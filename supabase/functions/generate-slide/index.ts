// Supabase Edge Function: generate-slide
// Generates slide content using Kimi API with RAG retrieval for style inspiration

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Slide type archetypes with specific structures
const SLIDE_ARCHETYPES: Record<string, {
  name: string;
  description: string;
  structure: string;
  layout: string;
}> = {
  'Executive Summary': {
    name: 'Executive Summary',
    description: 'Pyramid principle - lead with the "so-what"',
    structure: `Structure:
- Single compelling headline (action-oriented, 5-8 words)
- 3-4 supporting bullets (max 12 words each, parallel structure)
- Optional: Key metric callout in sidebar or banner
- Follow pyramid principle: Insight first, then supporting points`,
    layout: '16:9 wireframe with centered title, bullets below, optional sidebar for key metric'
  },
  'Horizontal Flow': {
    name: 'Horizontal Flow',
    description: 'Process steps or timeline flowing left-to-right',
    structure: `Structure:
- Clear process title
- 3-5 sequential steps displayed horizontally
- Each step: Number + Action verb phrase + Brief detail
- Arrows or connectors between steps
- Optional: Timeline markers or phase labels`,
    layout: '16:9 wireframe with title top, process flow across middle, 3-5 evenly spaced steps left-to-right'
  },
  'Vertical Flow': {
    name: 'Vertical Flow',
    description: 'Issue tree or breakdown - top-down MECE hierarchy',
    structure: `Structure:
- Central question or topic at top
- 2-4 main branches below (MECE categories)
- Each branch has supporting sub-points
- Clear hierarchy with indentation or visual grouping
- Ensure MECE: Mutually Exclusive, Collectively Exhaustive`,
    layout: '16:9 wireframe with parent node at top, branching lines to 2-4 child nodes below'
  },
  'Graph / Chart': {
    name: 'Graph / Chart',
    description: 'Data visualization with clear insights',
    structure: `Structure:
- Title stating the insight (not just description)
- Primary chart type recommendation (bar, line, waterfall, etc.)
- Clear axis labels and units
- 2-3 key data callouts or annotations
- "So what" insight below the chart`,
    layout: '16:9 wireframe with title top-left, large chart area center, insight callouts on right or below'
  },
  'General': {
    name: 'General',
    description: 'Flexible structure based on content needs',
    structure: `Structure:
- Strong headline capturing main message
- 2-4 key points organized logically
- Supporting data or examples
- Clear visual hierarchy`,
    layout: '16:9 wireframe adapted to content - title prominent, content well-organized'
  }
};

interface GenerateSlideRequest {
  slide_type: string;
  audience: string;
  context: string;
  data?: string;
  key_takeaway?: string;
  presentation_mode?: boolean;
  // RAG options
  use_rag?: boolean;
  industry?: string;
  style_reference?: string;
  rag_limit?: number;
}

interface RetrievedSlide {
  id: string;
  title: string;
  industry?: string;
  slide_type: string;
  layout_pattern?: Record<string, unknown>;
  color_palette?: Record<string, unknown>;
  tags?: string[];
  content?: Record<string, unknown>;
  similarity: number;
  style_guidance?: {
    layout_description: string;
    primary_colors: string[];
    typography_style: string;
    visual_approach: string;
  };
}

interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KimiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Generate embedding for text using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    return []; // Return empty if no API key, RAG will be skipped
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1536
      })
    });

    if (!response.ok) {
      console.error('Embedding generation failed:', await response.text());
      return [];
    }

    const data = await response.json();
    return data.data[0]?.embedding || [];
  } catch (error) {
    console.error('Embedding error:', error);
    return [];
  }
}

/**
 * Search for internal reference slides (AI-only, system access)
 * These slides are not user-facing, used only for style inspiration
 */
async function searchInternalSlides(
  query: string,
  industry?: string,
  slideType?: string,
  limit: number = 3
): Promise<RetrievedSlide[]> {
  try {
    const embedding = await generateEmbedding(query);
    
    if (embedding.length === 0) {
      return [];
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Use search_internal_slides for AI-only internal references
    const { data: slides, error } = await supabase.rpc('search_internal_slides', {
      query_embedding: embedding,
      match_threshold: 0.5, // Lower threshold for internal references
      match_count: limit,
      filter_industry: industry || null,
      filter_slide_type: slideType || null
    });

    if (error) {
      console.error('RAG internal search error:', error);
      return [];
    }

    return slides || [];
  } catch (error) {
    console.error('RAG internal search error:', error);
    return [];
  }
}

/**
 * Format retrieved slides for the prompt
 */
function formatStyleExamples(slides: RetrievedSlide[]): string {
  if (slides.length === 0) {
    return '';
  }

  const examples = slides.map((slide, index) => {
    const sg = slide.style_guidance || {};
    return `
Example ${index + 1} (similarity: ${(slide.similarity * 100).toFixed(1)}%):
- Title: "${slide.title}"
- Type: ${slide.slide_type}${slide.industry ? ` | Industry: ${slide.industry}` : ''}
- Layout: ${sg.layout_description || 'Standard layout'}
- Colors: ${sg.primary_colors?.join(', ') || 'Professional palette'}
- Typography: ${sg.typography_style || 'Clean, professional'}
- Visual Approach: ${sg.visual_approach || 'Content-focused'}
${slide.tags?.length ? `- Tags: ${slide.tags.join(', ')}` : ''}
`;
  }).join('\n');

  return `

STYLE INSPIRATION FROM SIMILAR SLIDES:
Use the following slides as style and layout inspiration. Match their visual language, color schemes, and structural patterns while adapting to the current content:
${examples}

When generating this slide, incorporate the visual patterns from these examples while maintaining the consulting-grade standards.
`;
}

/**
 * Build the system prompt
 */
function buildSystemPrompt(): string {
  return `You are an elite consulting slide creation expert specializing in transforming complex business information into high-impact, executive-ready presentations. Your expertise draws from the communication principles of top-tier management consulting firms (McKinsey, BCG, Bain), emphasizing clarity, logical structure, and compelling visual storytelling.

CORE PRINCIPLES:
- MECE: Mutually Exclusive, Collectively Exhaustive organization
- Pyramid Principle: Lead with the "so-what", support with evidence
- Executive-level tone: Clear, concise, action-oriented
- Visual clarity: Every element serves a purpose

NEVER:
- Include raw prose or text blocks
- Use technical jargon without context
- Pull actual content from training data (use for structural inspiration only)

ALWAYS:
- Create clean bullet-point structure
- Generate 16:9 wireframe format specifications
- Provide complete text content for all elements
- Optimize for C-Suite and Private Equity audiences
- Maintain consistent visual language with provided style examples`;
}

/**
 * Build the user prompt
 */
function buildPrompt(request: GenerateSlideRequest, styleExamples: string): string {
  const archetype = SLIDE_ARCHETYPES[request.slide_type] || SLIDE_ARCHETYPES['General'];
  
  const presentationModeText = request.presentation_mode 
    ? 'PRESENTATION MODE: Presentation (streamlined, less detail, high impact)'
    : 'PRESENTATION MODE: Read Mode (comprehensive, more detail for reading)';

  const dataSection = request.data 
    ? `\nDATA PROVIDED:\n${request.data}\n\nTransform this data into structured insights using MECE principles.`
    : '';

  const takeawaySection = request.key_takeaway
    ? `\nKEY TAKEAWAY TO EMPHASIZE: ${request.key_takeaway}\nThis should be front-and-center in the headline or opening.`
    : '';

  const industrySection = request.industry
    ? `\nINDUSTRY CONTEXT: ${request.industry}\nAdapt language and examples appropriate for this industry.`
    : '';

  const ragSection = styleExamples ? styleExamples : '';

  return `Create a consulting-grade slide with the following specifications:

SLIDE TYPE: ${archetype.name}
${archetype.description}

TARGET AUDIENCE: ${request.audience}
${presentationModeText}${industrySection}

CONTEXT:
${request.context}${dataSection}${takeawaySection}${ragSection}

---

REQUIRED STRUCTURE:
${archetype.structure}

LAYOUT SPECIFICATION:
- Format: 16:9 aspect ratio wireframe
- Style: Clean, professional, consulting-grade
- ${archetype.layout}

OUTPUT REQUIREMENTS:
Return a JSON object with this exact structure:
{
  "headline": "Action-oriented headline (5-8 words, front-loads the insight)",
  "subheadline": "Optional supporting context (max 10 words)",
  "slide_type": "${archetype.name}",
  "layout": "${archetype.layout.split(' - ')[0]}",
  "content": {
    "primary_message": "The single most important takeaway",
    "bullet_points": [
      "First key point - max 12 words, parallel structure",
      "Second key point - clear and concise",
      "Third key point - action-oriented language"
    ],
    "supporting_elements": [
      {"type": "metric", "label": "Label", "value": "Value", "context": "Brief context"}
    ],
    "visual_structure": {
      "type": "${archetype.name.toLowerCase().replace(/ /g, '_')}",
      "description": "How elements are arranged on the slide"
    }
  },
  "chart_recommendation": {
    "type": "bar|line|waterfall|matrix|none",
    "description": "Chart description if applicable"
  },
  "mece_validation": {
    "categories": ["Category 1", "Category 2"],
    "exhaustive": true,
    "mutually_exclusive": true
  },
  "wireframe_specs": {
    "aspect_ratio": "16:9",
    "title_position": "top-center or top-left",
    "content_position": "center or main body",
    "accent_elements": ["sidebar", "callout_box", "dividers"]
  },
  "style_inspiration": {
    "used_rag": ${styleExamples ? 'true' : 'false'},
    "reference_count": ${styleExamples ? '3' : '0'},
    "color_suggestion": "Derive from style examples"
  }
}

IMPORTANT:
1. Follow MECE principle strictly - no overlaps, no gaps
2. Use parallel structure for all bullet points
3. Front-load insights (lead with the "so-what")
4. Keep bullets under 12 words each
5. ${styleExamples ? 'Incorporate visual patterns from the style examples provided above' : 'Follow clean, professional consulting aesthetic'}
6. Return ONLY valid JSON, no markdown formatting`;
}

async function callKimiAPI(messages: KimiMessage[]): Promise<string> {
  if (!KIMI_API_KEY) {
    throw new Error('KIMI_API_KEY not configured');
  }

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'moonshot-v1-128k',
      messages,
      temperature: 0.5,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kimi API error: ${response.status} - ${error}`);
  }

  const data: KimiResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

function parseAIResponse(aiResponse: string, request: GenerateSlideRequest): Record<string, unknown> {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)```/) || 
                      aiResponse.match(/```\s*([\s\S]*?)```/) ||
                      [null, aiResponse];
    const jsonStr = jsonMatch[1]?.trim() || aiResponse.trim();
    
    // Remove any non-JSON text before/after
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}') + 1;
    const cleanJson = jsonStr.slice(jsonStart, jsonEnd);
    
    return JSON.parse(cleanJson);
  } catch (e) {
    // Fallback: create structured response from text
    console.error('JSON parse failed, using fallback:', e);
    return {
      headline: request.key_takeaway || 'Strategic Insights',
      subheadline: request.slide_type,
      slide_type: request.slide_type,
      layout: 'standard',
      content: {
        primary_message: request.key_takeaway || 'Key insights from analysis',
        bullet_points: [aiResponse.substring(0, 200)],
        supporting_elements: [],
        visual_structure: { type: 'text', description: 'Text-based layout' }
      },
      chart_recommendation: { type: 'none', description: '' },
      mece_validation: { categories: [], exhaustive: true, mutually_exclusive: true },
      wireframe_specs: {
        aspect_ratio: '16:9',
        title_position: 'top',
        content_position: 'center',
        accent_elements: []
      },
      style_inspiration: { used_rag: false, reference_count: 0 },
      raw_response: aiResponse
    };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      }
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: GenerateSlideRequest = await req.json();
    
    // Validate required fields
    if (!body.slide_type || !body.context || !body.audience) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: slide_type, context, audience' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate slide_type
    const validTypes = Object.keys(SLIDE_ARCHETYPES);
    if (!validTypes.includes(body.slide_type)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid slide_type. Must be one of: ${validTypes.join(', ')}` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user ID from token for RAG
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    const userId = user?.id || '';

    // RAG Retrieval Step - Search internal reference slides (AI-only)
    let styleExamples = '';
    let retrievedSlides: RetrievedSlide[] = [];
    
    if (body.use_rag !== false) { // RAG enabled by default
      const searchQuery = `${body.context} ${body.key_takeaway || ''} ${body.slide_type}`;
      // Search internal_reference slides only - these are AI-only, not user-facing
      retrievedSlides = await searchInternalSlides(
        searchQuery,
        body.industry,
        body.slide_type,
        body.rag_limit || 3
      );
      styleExamples = formatStyleExamples(retrievedSlides);
    }

    // Build prompt and call Kimi API
    const prompt = buildPrompt(body, styleExamples);
    const messages: KimiMessage[] = [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: prompt }
    ];

    const aiResponse = await callKimiAPI(messages);
    
    // Parse AI response
    const slideContent = parseAIResponse(aiResponse, body);
    
    // Add metadata
    const enrichedContent = {
      ...slideContent,
      metadata: {
        generated_at: new Date().toISOString(),
        audience: body.audience,
        presentation_mode: body.presentation_mode || false,
        input_data_provided: !!body.data,
        input_key_takeaway: body.key_takeaway || null,
        rag_used: retrievedSlides.length > 0,
        rag_references: retrievedSlides.map(s => ({
          id: s.id,
          title: s.title,
          similarity: s.similarity
        }))
      }
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: enrichedContent
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error) {
    console.error('Generate slide error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});
