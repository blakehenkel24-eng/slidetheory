-- Migration: 005_create_slide_library.sql
-- Create slide library with pgvector embeddings for RAG retrieval

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create slide_library table for storing slide embeddings and metadata
CREATE TABLE IF NOT EXISTS public.slide_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    industry TEXT,
    slide_type TEXT NOT NULL,
    layout_pattern JSONB DEFAULT '{}',
    color_palette JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    source TEXT NOT NULL CHECK (source IN ('uploaded', 'generated', 'template', 'reference')),
    file_url TEXT,
    preview_url TEXT,
    content JSONB DEFAULT '{}',
    extracted_text TEXT,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create slide_uploads table for tracking user uploads
CREATE TABLE IF NOT EXISTS public.slide_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    library_id UUID REFERENCES public.slide_library(id) ON DELETE SET NULL,
    original_filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    processing_error TEXT,
    extracted_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create index for vector similarity search
CREATE INDEX idx_slide_library_embedding ON public.slide_library 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create indexes for common queries
CREATE INDEX idx_slide_library_user_id ON public.slide_library(user_id);
CREATE INDEX idx_slide_library_industry ON public.slide_library(industry);
CREATE INDEX idx_slide_library_slide_type ON public.slide_library(slide_type);
CREATE INDEX idx_slide_library_source ON public.slide_library(source);
CREATE INDEX idx_slide_library_tags ON public.slide_library USING GIN(tags);
CREATE INDEX idx_slide_library_created_at ON public.slide_library(created_at DESC);

-- Create indexes for slide_uploads
CREATE INDEX idx_slide_uploads_user_id ON public.slide_uploads(user_id);
CREATE INDEX idx_slide_uploads_library_id ON public.slide_uploads(library_id);
CREATE INDEX idx_slide_uploads_status ON public.slide_uploads(processing_status);

-- Enable Row Level Security
ALTER TABLE public.slide_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slide_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for slide_library
CREATE POLICY "Users can view own library slides"
    ON public.slide_library FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL); -- Allow public templates

CREATE POLICY "Users can insert own library slides"
    ON public.slide_library FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library slides"
    ON public.slide_library FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own library slides"
    ON public.slide_library FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for slide_uploads
CREATE POLICY "Users can view own uploads"
    ON public.slide_uploads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploads"
    ON public.slide_uploads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploads"
    ON public.slide_uploads FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads"
    ON public.slide_uploads FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slide_library TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.slide_uploads TO authenticated;

-- Create function for similarity search
CREATE OR REPLACE FUNCTION public.search_similar_slides(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INTEGER DEFAULT 5,
    filter_user_id UUID DEFAULT NULL,
    filter_industry TEXT DEFAULT NULL,
    filter_slide_type TEXT DEFAULT NULL
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
    similarity FLOAT
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
        1 - (sl.embedding <=> query_embedding) AS similarity
    FROM public.slide_library sl
    WHERE 
        -- Only return slides with sufficient similarity
        1 - (sl.embedding <=> query_embedding) > match_threshold
        -- Optional user filter (allow public templates when user_id is null)
        AND (filter_user_id IS NULL OR sl.user_id = filter_user_id OR sl.user_id IS NULL)
        -- Optional industry filter
        AND (filter_industry IS NULL OR sl.industry = filter_industry)
        -- Optional slide type filter
        AND (filter_slide_type IS NULL OR sl.slide_type = filter_slide_type)
    ORDER BY sl.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get slides by style pattern
CREATE OR REPLACE FUNCTION public.get_slides_by_style(
    p_layout_pattern JSONB DEFAULT NULL,
    p_color_palette JSONB DEFAULT NULL,
    p_match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    layout_pattern JSONB,
    color_palette JSONB,
    match_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.id,
        sl.title,
        sl.layout_pattern,
        sl.color_palette,
        CASE
            WHEN p_layout_pattern IS NOT NULL AND sl.layout_pattern @> p_layout_pattern THEN 0.5
            ELSE 0
        END +
        CASE
            WHEN p_color_palette IS NOT NULL AND sl.color_palette @> p_color_palette THEN 0.5
            ELSE 0
        END AS match_score
    FROM public.slide_library sl
    WHERE 
        (p_layout_pattern IS NULL OR sl.layout_pattern @> p_layout_pattern)
        OR (p_color_palette IS NULL OR sl.color_palette @> p_color_palette)
    ORDER BY match_score DESC
    LIMIT p_match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update slide library timestamps
CREATE OR REPLACE FUNCTION update_slide_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_slide_library_updated_at
    BEFORE UPDATE ON public.slide_library
    FOR EACH ROW
    EXECUTE FUNCTION update_slide_library_updated_at();

-- Create view for slide library analytics
CREATE OR REPLACE VIEW public.slide_library_analytics AS
SELECT
    sl.industry,
    sl.slide_type,
    sl.source,
    COUNT(*) as slide_count,
    COUNT(sl.embedding) as with_embedding_count,
    MIN(sl.created_at) as first_created,
    MAX(sl.created_at) as last_created
FROM public.slide_library sl
GROUP BY sl.industry, sl.slide_type, sl.source;

-- Create function to get user library stats
CREATE OR REPLACE FUNCTION public.get_user_library_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_slides', COUNT(*),
        'uploaded_slides', COUNT(*) FILTER (WHERE source = 'uploaded'),
        'generated_slides', COUNT(*) FILTER (WHERE source = 'generated'),
        'template_slides', COUNT(*) FILTER (WHERE source = 'template'),
        'industries', ARRAY_AGG(DISTINCT industry) FILTER (WHERE industry IS NOT NULL),
        'slide_types', ARRAY_AGG(DISTINCT slide_type),
        'with_embeddings', COUNT(*) FILTER (WHERE embedding IS NOT NULL)
    )
    INTO result
    FROM public.slide_library
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.slide_library IS 'Repository of slides with embeddings for RAG retrieval';
COMMENT ON COLUMN public.slide_library.embedding IS '1536-dimensional vector embedding for semantic search';
COMMENT ON COLUMN public.slide_library.layout_pattern IS 'JSON describing slide layout structure';
COMMENT ON COLUMN public.slide_library.color_palette IS 'JSON describing color scheme used';
COMMENT ON TABLE public.slide_uploads IS 'Tracks user-uploaded slide files for processing';
COMMENT ON FUNCTION public.search_similar_slides IS 'Performs vector similarity search on slide library';
