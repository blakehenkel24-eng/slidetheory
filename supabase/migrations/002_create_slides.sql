-- Migration: 002_create_slides.sql
-- Create slides table for storing generated slides

-- Create slides table
CREATE TABLE IF NOT EXISTS public.slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    slide_type TEXT NOT NULL,
    audience TEXT,
    context TEXT,
    data TEXT,
    key_takeaway TEXT,
    presentation_mode BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_slides_user_id ON public.slides(user_id);
CREATE INDEX idx_slides_created_at ON public.slides(created_at DESC);
CREATE INDEX idx_slides_slide_type ON public.slides(slide_type);
CREATE INDEX idx_slides_user_created ON public.slides(user_id, created_at DESC);

-- Create GIN index for content JSONB queries
CREATE INDEX idx_slides_content ON public.slides USING GIN(content);

-- Enable Row Level Security
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_slides_updated_at
    BEFORE UPDATE ON public.slides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.slides IS 'Generated slides storage for SlideTheory';
COMMENT ON COLUMN public.slides.content IS 'JSON containing slide HTML, data, and metadata';
