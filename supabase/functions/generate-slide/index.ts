// Supabase Edge Function: Generate structured slide blueprint WITH RAG
// Uses McKinsey/BCG/Bain consulting standards + internal reference retrieval

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SYSTEM_PROMPT = `You are an elite strategy consultant who spent 20 years at McKinsey, Bain, and BCG.

## YOUR TASK
Transform raw context into a structured, consultant-quality slide blueprint that follows industry best practices.

## REFERENCE EXAMPLES (USE THESE AS STYLE GUIDE)
You will be provided with examples of high-quality consulting slides. Use them to understand:
- How action titles are written
- How layouts are chosen for different content types
- The tone and language used
- How data is presented with insights

## THE PYRAMID PRINCIPLE (MANDATORY)
Structure every slide top-down:
1. MAIN POINT (Title): The key takeaway/insight
2. KEY ARGUMENTS: 2-4 supporting pillars (MECE)
3. SUPPORTING DATA: Evidence for each argument

## ACTION TITLES (CRITICAL)
The title MUST be action-oriented, NOT descriptive.

BAD: "Revenue Analysis" or "Market Overview"
GOOD: "Revenue growth accelerated to 15% driven by digital transformation"

Formula: [Subject] + [Action/Change] + [Key Driver/Result]

## SLIDE LAYOUT SELECTION
Choose the layout that best fits the story:

EXECUTIVE-SUMMARY: High-level overview, 3-4 key bullets
ISSUE-TREE: Hierarchical breakdown of complex problems
2X2-MATRIX: Compare options on two dimensions
WATERFALL: Show progression or breakdown
COMPARISON: Side-by-side option analysis
PROCESS-FLOW: Step-by-step workflows

## OUTPUT FORMAT - JSON ONLY:
{
  "title": "Action-oriented slide title with insight (5-12 words)",
  "subtitle": "Supporting context if needed",
  "layout": "executive-summary | issue-tree | 2x2-matrix | waterfall | process-flow | comparison",
  "keyMessage": "The single most important takeaway",
  "supportingPoints": ["Point 1: Insight with data AND so-what", "Point 2..."],
  "dataHighlights": [{"metric": "Number", "context": "What it means"}],
  "chartRecommendation": {"type": "bar", "title": "Chart insight", "data": "What to show"},
  "visualElements": {"calloutBoxes": ["Key insight"], "icons": ["metaphor"]},
  "structureRationale": "Why this layout was chosen",
  "imagePrompt": "Detailed prompt for image generation"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const { 
      context, 
      keyTakeaway, 
      slideType = 'auto-select', 
      audience = 'auto-select',
      data = '',
      presentationMode = 'read',
      useRag = true  // NEW: Enable RAG by default
    } = await req.json();

    if (!context || !keyTakeaway) {
      return new Response(
        JSON.stringify({ error: 'Context and key takeaway are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Initialize Supabase client for RAG
    let referenceExamples = [];
    
    if (useRag && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // Generate embedding for the query
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-large',  // Use large model
            input: `${keyTakeaway} ${context}`.substring(0, 8000),
          })
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          const queryEmbedding = embeddingData.data?.[0]?.embedding;
          
          if (queryEmbedding) {
            // Call search_internal_slides RPC
            const { data: slides, error } = await supabase.rpc('search_internal_slides', {
              query_embedding: queryEmbedding,
              match_threshold: 0.5,
              match_count: 3,
              filter_slide_type: slideType !== 'auto-select' ? slideType : null
            });
            
            if (!error && slides && slides.length > 0) {
              referenceExamples = slides;
              console.log(`RAG: Found ${slides.length} reference examples`);
            }
          }
        }
      } catch (ragError) {
        console.error('RAG retrieval error:', ragError);
        // Continue without RAG if it fails
      }
    }

    // Build the prompt with reference examples if available
    let promptWithExamples = '';
    
    if (referenceExamples.length > 0) {
      promptWithExamples = `## REFERENCE EXAMPLES (Study these for style and structure):\n\n`;
      referenceExamples.forEach((ex, i) => {
        promptWithExamples += `--- Example ${i + 1} ---\n`;
        promptWithExamples += `Title: ${ex.title}\n`;
        promptWithExamples += `Type: ${ex.slide_type}\n`;
        promptWithExamples += `Layout Pattern: ${JSON.stringify(ex.layout_pattern)}\n`;
        promptWithExamples += `Content: ${ex.extracted_text?.substring(0, 500) || ''}...\n\n`;
      });
      promptWithExamples += `--- END EXAMPLES ---\n\n`;
    }

    // STEP 1: Analyze content to recommend best layout
    const layoutRecommendation = recommendLayout(context, keyTakeaway, data, slideType);

    // STEP 2: Create structured blueprint with OpenAI
    const blueprintPrompt = buildBlueprintPrompt(
      context, 
      keyTakeaway, 
      slideType, 
      audience, 
      data, 
      presentationMode, 
      layoutRecommendation,
      promptWithExamples
    );
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: blueprintPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      throw new Error(`OpenAI error: ${error}`);
    }

    const openaiData = await openaiResponse.json();
    const blueprintText = openaiData.choices?.[0]?.message?.content || '{}';
    
    // Parse the blueprint
    let blueprint;
    try {
      const jsonMatch = blueprintText.match(/```json\n?([\s\S]*?)\n?```/) || 
                        blueprintText.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : blueprintText;
      blueprint = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse blueprint:', e);
      blueprint = createFallbackBlueprint(keyTakeaway, context, slideType);
    }

    // STEP 3: Generate slide content from blueprint
    const slideContent = renderSlideFromBlueprint(blueprint, presentationMode);

    const qualityAssessment = blueprint.qualityAssessment || {
      actionTitle: 3,
      meceStructure: 3,
      pyramidPrinciple: 3,
      dataQuality: 3,
      soWhat: 3,
      visualClarity: 3,
      overall: 3,
      isExecutiveReady: false,
      strengths: ["Solid foundation"],
      improvements: ["Review for refinements"]
    };

    return new Response(
      JSON.stringify({
        success: true,
        jobId: crypto.randomUUID(),
        blueprint,
        slide: {
          id: crypto.randomUUID(),
          title: blueprint.title,
          content: slideContent,
          layout: blueprint.layout,
          imagePrompt: blueprint.imagePrompt,
          type: slideType,
          qualityAssessment,
        },
        rag: {
          used: referenceExamples.length > 0,
          examplesFound: referenceExamples.length,
          exampleTitles: referenceExamples.map(ex => ex.title)
        },
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
});

function recommendLayout(context: string, keyTakeaway: string, data: string, slideType: string): string {
  const text = (context + ' ' + keyTakeaway + ' ' + data).toLowerCase();
  
  if (slideType !== 'auto-select') return slideType;
  
  if (text.includes('compared to') || text.includes('versus') || text.includes('vs')) {
    return 'comparison';
  }
  if (text.includes('breakdown') || text.includes('broken into') || text.includes('categories')) {
    return 'issue-tree';
  }
  if (text.includes('over time') || text.includes('trend') || text.includes('growth') || text.includes('decline')) {
    return 'executive-summary';
  }
  if (text.includes('process') || text.includes('steps') || text.includes('workflow')) {
    return 'process-flow';
  }
  if (text.includes('portfolio') || text.includes('positioning') || text.includes('matrix')) {
    return '2x2-matrix';
  }
  if (text.includes('bridge') || text.includes('walk') || text.includes('from') && text.includes('to')) {
    return 'waterfall';
  }
  
  return 'executive-summary';
}

function buildBlueprintPrompt(
  context: string, 
  keyTakeaway: string, 
  slideType: string, 
  audience: string, 
  data: string, 
  mode: string, 
  recommendedLayout: string,
  examples: string
): string {
  return `${examples}
Create a consultant-quality slide blueprint from this context:

## USER'S KEY TAKEAWAY (MUST BE THE FOCUS):
${keyTakeaway}

## RAW CONTEXT:
${context}

## ADDITIONAL DATA:
${data || 'None provided'}

## TARGET AUDIENCE:
${audience}

## PRESENTATION MODE:
${mode}

## RECOMMENDED LAYOUT:
${recommendedLayout}
${recommendedLayout !== slideType && slideType !== 'auto-select' ? `(User prefers: ${slideType})` : ''}

---
Create a JSON blueprint following the system instructions. Study the reference examples above for style guidance.

CRITICAL:
1. The TITLE must be an action title with insight (not descriptive)
2. Choose the layout that best tells the story
3. Every supporting point must have data AND explain "so what?"
4. Follow MECE - categories should not overlap
5. Follow Pyramid Principle - top down structure

Respond with valid JSON only.`;
}

function createFallbackBlueprint(keyTakeaway: string, context: string, slideType: string) {
  return {
    title: keyTakeaway,
    layout: slideType === 'auto-select' ? 'executive-summary' : slideType,
    keyMessage: keyTakeaway,
    supportingPoints: [context],
    dataHighlights: [],
    structureRationale: 'Fallback due to parsing error'
  };
}

function renderSlideFromBlueprint(blueprint: any, mode: string): string {
  const isPresentation = mode === 'presentation';
  const layout = blueprint.layout || 'executive-summary';
  
  switch (layout) {
    case 'issue-tree':
      return renderIssueTree(blueprint, isPresentation);
    case '2x2-matrix':
      return render2x2Matrix(blueprint, isPresentation);
    case 'waterfall':
      return renderWaterfall(blueprint, isPresentation);
    case 'comparison':
      return renderComparison(blueprint, isPresentation);
    case 'process-flow':
      return renderProcessFlow(blueprint, isPresentation);
    default:
      return renderExecutiveSummary(blueprint, isPresentation);
  }
}

function renderExecutiveSummary(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container executive-summary">`;
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  if (blueprint.subtitle) {
    html += `<p class="slide-subtitle">${blueprint.subtitle}</p>`;
  }
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  if (blueprint.supportingPoints?.length > 0) {
    html += `<div class="supporting-section">`;
    html += `<h3 class="section-label">Key Insights:</h3>`;
    html += `<ul class="supporting-points">`;
    blueprint.supportingPoints.forEach((point: string) => {
      html += `<li>${point}</li>`;
    });
    html += `</ul></div>`;
  }
  
  html += `</div>`;
  return html;
}

function renderIssueTree(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container issue-tree">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  html += `</div>`;
  return html;
}

function render2x2Matrix(blueprint: any, isPresentation: boolean): string {
  return `<div class="slide-container matrix-2x2"><h1>${blueprint.title}</h1></div>`;
}

function renderWaterfall(blueprint: any, isPresentation: boolean): string {
  return `<div class="slide-container waterfall"><h1>${blueprint.title}</h1></div>`;
}

function renderComparison(blueprint: any, isPresentation: boolean): string {
  return `<div class="slide-container comparison"><h1>${blueprint.title}</h1></div>`;
}

function renderProcessFlow(blueprint: any, isPresentation: boolean): string {
  return `<div class="slide-container process-flow"><h1>${blueprint.title}</h1></div>`;
}