-- Seed Script: Populate slide_library with INTERNAL reference slides
-- These are NOT user-facing - used only by AI for style inspiration
-- Run this after migration 006_add_internal_reference_access.sql

-- Helper function to generate a random embedding (for seeding without API calls)
-- In production, use actual OpenAI embeddings
CREATE OR REPLACE FUNCTION generate_random_embedding(dimensions INT DEFAULT 1536)
RETURNS VECTOR AS $$
DECLARE
  embedding FLOAT[];
BEGIN
  SELECT ARRAY_AGG(random() * 2 - 1)
  INTO embedding
  FROM generate_series(1, dimensions);
  
  RETURN embedding::VECTOR;
END;
$$ LANGUAGE plpgsql;

-- Insert INTERNAL reference slides from McKinsey decks
-- These are NOT visible to users - AI-only for RAG inspiration
INSERT INTO public.slide_library (
  user_id,
  title,
  industry,
  slide_type,
  layout_pattern,
  color_palette,
  tags,
  source,
  access_level,
  file_url,
  preview_url,
  content,
  extracted_text,
  embedding,
  metadata
) VALUES
-- Executive Summary Title Slide (INTERNAL)
(
  NULL,
  '[INTERNAL] McKinsey Top Trends 2022 - Executive Summary',
  'consulting',
  'Executive Summary',
  '{
    "type": "Executive Summary",
    "title_position": "top-left, bold headline",
    "content_structure": "headline + 4 key trends + sidebar metrics",
    "visual_hierarchy": "pyramid principle - headline insight first",
    "typography": "Bower, sans-serif, generous whitespace",
    "spacing": "16:9, 40px margins, consistent gutters"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF", "#0077B6"],
    "secondary": ["#E8F4F8", "#B8E0F0", "#88CCE8"],
    "accent": ["#FF6B35", "#00C853"],
    "background": ["#FFFFFF", "#F5F7FA"],
    "text": ["#051C2C", "#2D3748", "#718096"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'trends', '2022', 'executive-summary', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-top-trends-exec-summary.pdf',
  NULL,
  '{
    "headline": "The top trends in 2022",
    "key_trends": [
      "Inflation and supply chain disruptions reshape consumer behavior",
      "Remote work becomes permanent fixture across industries",
      "Sustainability moves from compliance to growth driver",
      "Digital transformation accelerates in traditional sectors"
    ],
    "sidebar_metrics": [
      {"label": "Trends Analyzed", "value": "14"},
      {"label": "Industries Covered", "value": "12"}
    ],
    "page_number": 1,
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  'The top trends in 2022. Inflation and supply chain disruptions reshape consumer behavior. Remote work becomes permanent fixture across industries. Sustainability moves from compliance to growth driver. Digital transformation accelerates in traditional sectors.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "document_type": "executive_summary",
    "year": 2022,
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),

-- Trend Detail Slide: Inflation (INTERNAL)
(
  NULL,
  '[INTERNAL] Inflation Impact Analysis - Chart Layout',
  'consulting',
  'Graph / Chart',
  '{
    "type": "Graph / Chart",
    "title_position": "top-left, insight-focused",
    "content_structure": "chart title + large bar chart + 3 key callouts",
    "visual_hierarchy": "data-driven, supporting text minimal",
    "typography": "Bower for headlines, Source Sans for data",
    "spacing": "16:9, chart occupies 60% of slide"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF", "#0077B6"],
    "secondary": ["#E8F4F8", "#B8E0F0"],
    "accent": ["#FF6B35"],
    "chart_colors": ["#2251FF", "#0077B6", "#051C2C"],
    "background": ["#FFFFFF"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'trends', 'inflation', 'data-visualization', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-top-trends-exec-summary.pdf',
  NULL,
  '{
    "headline": "Inflation drives 73% of consumers to change buying habits",
    "chart_type": "bar_chart",
    "key_insights": [
      "73% of consumers have switched brands due to price increases",
      "Private label adoption up 15% across categories",
      "Trade-down behavior most pronounced in discretionary categories"
    ],
    "data_source": "McKinsey Consumer Survey, Q3 2022",
    "page_number": 2,
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  'Inflation drives 73% of consumers to change buying habits. 73% of consumers have switched brands due to price increases. Private label adoption up 15% across categories. Trade-down behavior most pronounced in discretionary categories. McKinsey Consumer Survey Q3 2022.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "chart_type": "bar_chart",
    "data_driven": true,
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),

-- Trend Detail Slide: Remote Work (INTERNAL)
(
  NULL,
  '[INTERNAL] Remote Work Metrics - Percentage Layout',
  'consulting',
  'Graph / Chart',
  '{
    "type": "Graph / Chart",
    "title_position": "top-left, percentage prominent",
    "content_structure": "large percentage + segmented bar chart + trend implications",
    "visual_hierarchy": "metric-first, then breakdown",
    "typography": "Large numerals, clean labels",
    "spacing": "16:9, asymmetric layout"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF"],
    "secondary": ["#E8F4F8"],
    "accent": ["#00C853", "#FF6B35"],
    "chart_colors": ["#2251FF", "#88CCE8", "#E8F4F8"],
    "background": ["#FFFFFF"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'remote-work', 'future-of-work', 'data-visualization', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-top-trends-exec-summary.pdf',
  NULL,
  '{
    "headline": "58% of work now hybrid or fully remote",
    "key_metric": "58%",
    "breakdown": [
      "35% hybrid",
      "23% fully remote",
      "42% on-site"
    ],
    "implications": [
      "Real estate footprints shrinking 30%",
      "Technology investment in collaboration tools up 45%",
      "Talent pools now geographically unconstrained"
    ],
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  '58% of work now hybrid or fully remote. 35% hybrid, 23% fully remote, 42% on-site. Real estate footprints shrinking 30%. Technology investment in collaboration tools up 45%. Talent pools now geographically unconstrained.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "chart_type": "percentage_breakdown",
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),

-- Tech Trends Overview (INTERNAL)
(
  NULL,
  '[INTERNAL] Technology Trends 2022 - Framework Layout',
  'consulting',
  'Vertical Flow',
  '{
    "type": "Vertical Flow",
    "title_position": "top-center",
    "content_structure": "central theme + 4 technology pillars below",
    "visual_hierarchy": "top-down MECE structure",
    "typography": "Bower headlines, clean body text",
    "spacing": "16:9, balanced tree layout"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF", "#0077B6"],
    "secondary": ["#E8F4F8", "#B8E0F0"],
    "accent": ["#00C853", "#FF6B35", "#9C27B0"],
    "background": ["#FFFFFF", "#F5F7FA"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'technology', 'trends', '2022', 'strategy', 'framework', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-tech-trends-2022.pdf',
  NULL,
  '{
    "headline": "Four technology trends reshaping business in 2022",
    "framework": "MECE technology pillars",
    "pillars": [
      {
        "name": "Applied AI",
        "description": "Moving from experimentation to scaled deployment"
      },
      {
        "name": "Trust Architecture",
        "description": "Building resilience in digital ecosystems"
      },
      {
        "name": "Digital Identity",
        "description": "New models for authentication and privacy"
      },
      {
        "name": "Cloud Edge",
        "description": "Distributed computing at scale"
      }
    ],
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  'Four technology trends reshaping business in 2022. Applied AI: Moving from experimentation to scaled deployment. Trust Architecture: Building resilience in digital ecosystems. Digital Identity: New models for authentication and privacy. Cloud Edge: Distributed computing at scale.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "document_type": "trends_report",
    "year": 2022,
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),

-- Applied AI Deep Dive (INTERNAL)
(
  NULL,
  '[INTERNAL] AI Investment Trends - Waterfall Chart Layout',
  'consulting',
  'Graph / Chart',
  '{
    "type": "Graph / Chart",
    "title_position": "top-left",
    "content_structure": "waterfall chart + 2 supporting callouts",
    "visual_hierarchy": "chart dominant, text minimal",
    "typography": "Clean data labels, strong headline",
    "spacing": "16:9, waterfall centered"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF"],
    "secondary": ["#E8F4F8"],
    "accent": ["#00C853"],
    "chart_colors": ["#2251FF", "#0077B6", "#051C2C"],
    "background": ["#FFFFFF"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'ai', 'artificial-intelligence', 'investment', 'data-visualization', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-tech-trends-2022.pdf',
  NULL,
  '{
    "headline": "AI investment reached $93B in 2022",
    "chart_type": "waterfall",
    "key_data_points": [
      "Total AI investment: $93B (+15% YoY)",
      "Applied AI vs R&D: 70/30 split",
      "Top sectors: Healthcare, Finance, Manufacturing"
    ],
    "insight": "Shift from experimental to production AI",
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  'AI investment reached $93B in 2022. Total AI investment 93B +15% YoY. Applied AI vs R&D 70/30 split. Top sectors Healthcare, Finance, Manufacturing. Shift from experimental to production AI.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "chart_type": "waterfall",
    "topic": "artificial_intelligence",
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),

-- Process Flow: AI Implementation (INTERNAL)
(
  NULL,
  '[INTERNAL] AI Implementation Journey - Process Flow Layout',
  'consulting',
  'Horizontal Flow',
  '{
    "type": "Horizontal Flow",
    "title_position": "top-center",
    "content_structure": "5 sequential steps with arrows",
    "visual_hierarchy": "left-to-right progression",
    "typography": "Numbered steps, clear action verbs",
    "spacing": "16:9, evenly distributed steps"
  }'::JSONB,
  '{
    "primary": ["#051C2C", "#2251FF"],
    "secondary": ["#E8F4F8"],
    "accent": ["#00C853"],
    "step_colors": ["#051C2C", "#2251FF", "#0077B6", "#88CCE8", "#B8E0F0"],
    "background": ["#FFFFFF"]
  }'::JSONB,
  ARRAY['mckinsey', 'internal', 'ai', 'implementation', 'process', 'framework', 'consulting', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/knowledge-base/reference-decks/mckinsey-tech-trends-2022.pdf',
  NULL,
  '{
    "headline": "Five steps to AI at scale",
    "steps": [
      "1. Strategy: Define AI ambition and use cases",
      "2. Data: Build unified data architecture",
      "3. Model: Develop and train AI models",
      "4. Deploy: Integrate into business processes",
      "5. Scale: Expand across organization"
    ],
    "key_enablers": ["Executive sponsorship", "Cross-functional teams", "Agile methodology"],
    "consulting_firm": "mckinsey",
    "internal_use_only": true
  }'::JSONB,
  'Five steps to AI at scale. 1. Strategy Define AI ambition and use cases. 2. Data Build unified data architecture. 3. Model Develop and train AI models. 4. Deploy Integrate into business processes. 5. Scale Expand across organization.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "consulting_firm": "mckinsey",
    "framework_type": "process_flow",
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
);

-- Insert Generated Export slides as INTERNAL references (AI training data)
INSERT INTO public.slide_library (
  user_id,
  title,
  industry,
  slide_type,
  layout_pattern,
  color_palette,
  tags,
  source,
  access_level,
  file_url,
  preview_url,
  content,
  extracted_text,
  embedding,
  metadata
) VALUES
(
  NULL,
  '[INTERNAL] Generated Export - Market Analysis Pattern',
  'general',
  'Graph / Chart',
  '{
    "type": "Graph / Chart",
    "title_position": "top-left",
    "content_structure": "title + chart + 2-3 insights",
    "visual_hierarchy": "chart-centric",
    "typography": "clean, professional",
    "spacing": "standard 16:9"
  }'::JSONB,
  '{
    "primary": ["#1E3A5F", "#2E5C8A"],
    "secondary": ["#E8F1F8", "#D1E3F0"],
    "accent": ["#D97706"],
    "background": ["#FFFFFF", "#F8FAFC"]
  }'::JSONB,
  ARRAY['generated', 'internal', 'market-analysis', 'general', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/tmp/exports/',
  NULL,
  '{
    "type": "market_analysis_template",
    "description": "Generic market analysis slide structure",
    "internal_use_only": true
  }'::JSONB,
  'Market analysis template. Clean chart layout with professional color scheme. Suitable for general business presentations.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "generated": true,
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
),
(
  NULL,
  '[INTERNAL] Generated Export - Executive Summary Pattern',
  'general',
  'Executive Summary',
  '{
    "type": "Executive Summary",
    "title_position": "top-left",
    "content_structure": "headline + 3-4 bullets + optional metric",
    "visual_hierarchy": "pyramid principle",
    "typography": "strong headline, clean bullets",
    "spacing": "generous whitespace"
  }'::JSONB,
  '{
    "primary": ["#1E3A5F", "#2E5C8A"],
    "secondary": ["#E8F1F8"],
    "accent": ["#059669"],
    "background": ["#FFFFFF", "#F8FAFC"]
  }'::JSONB,
  ARRAY['generated', 'internal', 'executive-summary', 'general', 'ai-reference'],
  'internal_reference',
  'system',
  'file:///products/slidetheory/mvp/build/tmp/exports/',
  NULL,
  '{
    "type": "executive_summary_template",
    "description": "Generic executive summary structure",
    "internal_use_only": true
  }'::JSONB,
  'Executive summary template. Pyramid principle structure with strong headline and supporting bullets. Clean professional design.',
  generate_random_embedding(),
  '{
    "source_type": "internal_reference",
    "generated": true,
    "access_restriction": "system_only",
    "purpose": "ai_style_inspiration"
  }'::JSONB
);

-- Show seeding results
SELECT 
  'Internal Reference Slides Seeded' as status,
  COUNT(*) FILTER (WHERE source = 'internal_reference') as internal_slides,
  COUNT(*) FILTER (WHERE access_level = 'system') as system_only_slides,
  COUNT(*) FILTER (WHERE industry = 'consulting') as consulting_slides,
  COUNT(DISTINCT slide_type) as slide_archetypes
FROM public.slide_library
WHERE source = 'internal_reference';

-- Clean up helper function
DROP FUNCTION IF EXISTS generate_random_embedding;

-- Grant permissions (but users still can't see system slides due to RLS)
GRANT SELECT ON public.slide_library TO authenticated;
