-- Migration: 004_add_slide_archetypes.sql
-- Add support for consulting slide archetypes and 16:9 format

-- Add new columns to slides table for archetype data
ALTER TABLE public.slides 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS subheadline TEXT,
ADD COLUMN IF NOT EXISTS layout_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS wireframe_specs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mece_validation JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS chart_recommendation JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primary_message TEXT;

-- Create index for layout types
CREATE INDEX IF NOT EXISTS idx_slides_layout_type ON public.slides(layout_type);

-- Create slide archetype enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'slide_archetype') THEN
    CREATE TYPE slide_archetype AS ENUM (
      'Executive Summary',
      'Horizontal Flow', 
      'Vertical Flow',
      'Graph / Chart',
      'General'
    );
  END IF;
END $$;

-- Add check constraint for valid slide types
ALTER TABLE public.slides 
ADD CONSTRAINT valid_slide_type 
CHECK (slide_type IN (
  'Executive Summary',
  'Horizontal Flow',
  'Vertical Flow', 
  'Graph / Chart',
  'General'
));

-- Create function to validate MECE structure
CREATE OR REPLACE FUNCTION public.validate_mece(
  p_categories TEXT[],
  p_content JSONB
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  category_count INT;
  has_overlaps BOOLEAN := false;
  has_gaps BOOLEAN := false;
BEGIN
  category_count := array_length(p_categories, 1);
  
  -- Basic MECE checks
  IF category_count IS NULL OR category_count < 2 THEN
    has_gaps := true;
  END IF;
  
  result := jsonb_build_object(
    'category_count', COALESCE(category_count, 0),
    'mutually_exclusive', NOT has_overlaps,
    'collectively_exhaustive', NOT has_gaps,
    'mece_score', CASE 
      WHEN has_overlaps OR has_gaps THEN 0
      ELSE 1
    END,
    'recommendations', CASE
      WHEN has_gaps THEN ARRAY['Add more categories to ensure full coverage']
      ELSE ARRAY[]::TEXT[]
    END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get slide by ID with full details
CREATE OR REPLACE FUNCTION public.get_slide_details(p_slide_id UUID)
RETURNS JSONB AS $$
DECLARE
  slide_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', s.id,
    'title', s.title,
    'headline', s.headline,
    'subheadline', s.subheadline,
    'slide_type', s.slide_type,
    'layout_type', s.layout_type,
    'primary_message', s.primary_message,
    'content', s.content,
    'wireframe_specs', s.wireframe_specs,
    'mece_validation', s.mece_validation,
    'chart_recommendation', s.chart_recommendation,
    'audience', s.audience,
    'context', s.context,
    'data', s.data,
    'key_takeaway', s.key_takeaway,
    'presentation_mode', s.presentation_mode,
    'image_url', s.image_url,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) INTO slide_data
  FROM public.slides s
  WHERE s.id = p_slide_id;
  
  RETURN slide_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for slide analytics
CREATE OR REPLACE VIEW public.slide_analytics AS
SELECT 
  s.slide_type,
  s.layout_type,
  COUNT(*) as slide_count,
  COUNT(s.image_url) as with_image_count,
  MIN(s.created_at) as first_created,
  MAX(s.created_at) as last_created
FROM public.slides s
GROUP BY s.slide_type, s.layout_type;

-- Grant permissions
GRANT SELECT ON public.slide_analytics TO authenticated;

COMMENT ON COLUMN public.slides.headline IS 'Primary slide headline (5-8 words, action-oriented)';
COMMENT ON COLUMN public.slides.wireframe_specs IS '16:9 layout specifications as JSON';
COMMENT ON COLUMN public.slides.mece_validation IS 'MECE validation results as JSON';
COMMENT ON COLUMN public.slides.chart_recommendation IS 'Recommended chart type and specs as JSON';
