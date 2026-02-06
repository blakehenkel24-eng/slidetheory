-- Migration: 006_add_internal_reference_access.sql
-- Add access_level column and internal_reference source for AI-only slides

-- Add access_level column
ALTER TABLE public.slide_library 
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'user' 
CHECK (access_level IN ('public', 'user', 'system'));

-- Update source constraint to include internal_reference
ALTER TABLE public.slide_library 
DROP CONSTRAINT IF EXISTS slide_library_source_check;

ALTER TABLE public.slide_library 
ADD CONSTRAINT slide_library_source_check 
CHECK (source IN ('uploaded', 'generated', 'template', 'reference', 'internal_reference'));

-- Create index for access_level
CREATE INDEX IF NOT EXISTS idx_slide_library_access_level ON public.slide_library(access_level);

-- Update RLS policies to respect access_level
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own library slides" ON public.slide_library;

-- Create new policy that excludes system access_level
CREATE POLICY "Users can view accessible library slides"
    ON public.slide_library FOR SELECT
    USING (
        -- User's own slides
        auth.uid() = user_id 
        -- Public templates (including reference materials)
        OR (access_level = 'public')
        -- Internal references are NOT visible to users (system only)
    );

-- Update search function to exclude internal_reference by default
CREATE OR REPLACE FUNCTION public.search_similar_slides(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INTEGER DEFAULT 5,
    filter_user_id UUID DEFAULT NULL,
    filter_industry TEXT DEFAULT NULL,
    filter_slide_type TEXT DEFAULT NULL,
    include_internal BOOLEAN DEFAULT FALSE  -- New parameter
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title TEXT,
    industry TEXT,
    slide_type TEXT,
    layout_pattern JSONB,
    color_palette JSONB,
    tags TEXT[],
    source TEXT,
    file_url TEXT,
    preview_url TEXT,
    content JSONB,
    similarity FLOAT,
    access_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.id,
        sl.user_id,
        sl.title,
        sl.industry,
        sl.slide_type,
        sl.layout_pattern,
        sl.color_palette,
        sl.tags,
        sl.source,
        sl.file_url,
        sl.preview_url,
        sl.content,
        1 - (sl.embedding <=> query_embedding) AS similarity,
        sl.access_level
    FROM public.slide_library sl
    WHERE 
        -- Only return slides with sufficient similarity
        1 - (sl.embedding <=> query_embedding) > match_threshold
        -- Optional user filter
        AND (filter_user_id IS NULL OR sl.user_id = filter_user_id)
        -- Optional industry filter
        AND (filter_industry IS NULL OR sl.industry = filter_industry)
        -- Optional slide type filter
        AND (filter_slide_type IS NULL OR sl.slide_type = filter_slide_type)
        -- Filter out internal_reference unless explicitly requested (by system)
        AND (include_internal OR sl.source != 'internal_reference')
    ORDER BY sl.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for system-only search (for AI generation)
CREATE OR REPLACE FUNCTION public.search_internal_slides(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.6,
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
    source TEXT,
    content JSONB,
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
        sl.source,
        sl.content,
        1 - (sl.embedding <=> query_embedding) AS similarity
    FROM public.slide_library sl
    WHERE 
        1 - (sl.embedding <=> query_embedding) > match_threshold
        AND sl.source = 'internal_reference'  -- Only internal references
        AND (filter_industry IS NULL OR sl.industry = filter_industry)
        AND (filter_slide_type IS NULL OR sl.slide_type = filter_slide_type)
    ORDER BY sl.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON COLUMN public.slide_library.access_level IS 'Access control: public (all users), user (owner only), system (AI internal use only)';
COMMENT ON FUNCTION public.search_similar_slides IS 'User-facing search - excludes internal_reference by default';
COMMENT ON FUNCTION public.search_internal_slides IS 'System-only search for AI generation - internal_reference slides only';
