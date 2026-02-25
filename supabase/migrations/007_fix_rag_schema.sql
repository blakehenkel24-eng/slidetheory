-- Migration: 007_fix_rag_schema.sql
-- Fixes RAG schema for proper internal reference handling

-- Add access_level column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'slide_library' AND column_name = 'access_level'
    ) THEN
        ALTER TABLE public.slide_library ADD COLUMN access_level TEXT DEFAULT 'public';
    END IF;
END $$;

-- Update source check constraint to include 'internal_reference'
-- First drop existing constraint
ALTER TABLE public.slide_library DROP CONSTRAINT IF EXISTS slide_library_source_check;

-- Add new constraint with internal_reference
ALTER TABLE public.slide_library ADD CONSTRAINT slide_library_source_check 
    CHECK (source IN ('uploaded', 'generated', 'template', 'reference', 'internal_reference'));

-- Create index on access_level for fast filtering
CREATE INDEX IF NOT EXISTS idx_slide_library_access_level ON public.slide_library(access_level);

-- Update RLS policies to respect access_level
DROP POLICY IF EXISTS "Users can view own library slides" ON public.slide_library;
DROP POLICY IF EXISTS "Users can view accessible library slides" ON public.slide_library;

-- New policy: Users see their own + public templates, but NOT system/internal slides
CREATE POLICY "Users can view accessible library slides"
    ON public.slide_library FOR SELECT
    USING (
        auth.uid() = user_id  -- Own slides
        OR (access_level = 'public' AND source != 'internal_reference')  -- Public non-internal
        -- system access_level is excluded - only service role can see these
    );

-- Policy for service role to see everything (used by edge functions)
CREATE POLICY "Service role can view all slides"
    ON public.slide_library FOR SELECT
    USING (auth.role() = 'service_role');

-- Function to search internal reference slides (AI-only, not user-facing)
CREATE OR REPLACE FUNCTION public.search_internal_slides(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INTEGER DEFAULT 5,
    filter_industry TEXT DEFAULT NULL,
    filter_slide_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    industry TEXT,
    slide_type TEXT,
    layout_pattern JSONB,
    color_palette JSONB,
    tags TEXT[],
    content JSONB,
    extracted_text TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.id,
        sl.title,
        sl.industry,
        sl.slide_type,
        sl.layout_pattern,
        sl.color_palette,
        sl.tags,
        sl.content,
        sl.extracted_text,
        1 - (sl.embedding <=> query_embedding) AS similarity
    FROM public.slide_library sl
    WHERE 
        -- Only internal_reference slides
        sl.source = 'internal_reference'
        -- Only system access level (AI-only)
        AND sl.access_level = 'system'
        -- Similarity threshold
        AND 1 - (sl.embedding <=> query_embedding) > match_threshold
        -- Optional industry filter
        AND (filter_industry IS NULL OR sl.industry = filter_industry)
        -- Optional slide type filter
        AND (filter_slide_type IS NULL OR sl.slide_type = filter_slide_type)
    ORDER BY sl.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get random internal reference examples (for diversity)
CREATE OR REPLACE FUNCTION public.get_internal_reference_examples(
    p_slide_type TEXT DEFAULT NULL,
    p_count INTEGER DEFAULT 3
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slide_type TEXT,
    layout_pattern JSONB,
    extracted_text TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.id,
        sl.title,
        sl.slide_type,
        sl.layout_pattern,
        sl.extracted_text
    FROM public.slide_library sl
    WHERE 
        sl.source = 'internal_reference'
        AND sl.access_level = 'system'
        AND (p_slide_type IS NULL OR sl.slide_type = p_slide_type)
    ORDER BY RANDOM()
    LIMIT p_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION public.search_internal_slides IS 'Search internal reference slides for AI RAG retrieval. Only returns slides with source=internal_reference and access_level=system. Should only be called by service role.';
COMMENT ON COLUMN public.slide_library.access_level IS 'Access control: public (all users), user (owner only), system (AI/internal only)';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.search_internal_slides TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_internal_reference_examples TO authenticated;