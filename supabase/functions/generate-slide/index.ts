// Supabase Edge Function: Generate structured slide blueprint
// Step 1: LLM creates slide architecture
// Step 2: Blueprint sent to image generation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SYSTEM_PROMPT = `You are an elite strategy consultant with 20 years at McKinsey, Bain, and BCG.

Your task: Transform raw context into a structured, consultant-quality slide blueprint.

## OUTPUT FORMAT - JSON ONLY:
{
  "title": "Action-oriented slide title (5-7 words max)",
  "subtitle": "Supporting context (optional, 10-15 words)",
  "layout": "executive-summary | issue-tree | 2x2-matrix | waterfall | process-flow | comparison",
  "keyMessage": "The single most important takeaway (1 sentence)",
  "supportingPoints": [
    "Point 1: Specific insight with data/context",
    "Point 2: Specific insight with data/context", 
    "Point 3: Specific insight with data/context"
  ],
  "dataHighlights": [
    {"metric": "Number", "context": "What it means"}
  ],
  "visualElements": {
    "chartType": "none | bar | line | pie | waterfall | quadrant",
    "calloutBoxes": ["Key insight 1", "Key insight 2"],
    "icons": ["relevant icon descriptions for image gen"]
  },
  "slideStructure": {
    "header": "Title text",
    "subheader": "Context line",
    "mainContent": "Formatted content ready for slide",
    "footer": "Source or date"
  },
  "imagePrompt": "Detailed prompt for image generation describing the visual layout and style"
}

## PRINCIPLES:
1. SO WHAT? - Every point must answer "so what?" 
2. ACTION-ORIENTED - Titles start with verbs (Reduce, Accelerate, Capture, Transform)
3. DATA-DRIVEN - Include specific numbers, percentages, timeframes
4. MBB STYLE - Pyramid principle, MECE structure, executive-ready
5. VISUAL - Describe what charts, icons, and layout would best communicate this

## DON'T:
- Don't just reword the input
- Don't use generic business speak
- Don't create lists without insights

## DO:
- Create NEW insights from the context
- Structure for maximum executive impact
- Make specific, defensible recommendations`;

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
      presentationMode = 'read'
    } = await req.json();

    if (!context || !keyTakeaway) {
      return new Response(
        JSON.stringify({ error: 'Context and key takeaway are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // STEP 1: Create structured blueprint with OpenAI
    const blueprintPrompt = buildBlueprintPrompt(context, keyTakeaway, slideType, audience, data, presentationMode);
    
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
        max_tokens: 2000,
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
      // Extract JSON if wrapped in markdown
      const jsonMatch = blueprintText.match(/```json\n?([\s\S]*?)\n?```/) || 
                        blueprintText.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : blueprintText;
      blueprint = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse blueprint:', e);
      blueprint = {
        title: keyTakeaway,
        layout: 'executive-summary',
        keyMessage: keyTakeaway,
        supportingPoints: [context],
        slideStructure: { mainContent: blueprintText }
      };
    }

    // STEP 2: Generate slide content from blueprint
    const slideContent = renderSlideFromBlueprint(blueprint, presentationMode);

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

function buildBlueprintPrompt(context: string, keyTakeaway: string, slideType: string, audience: string, data: string, mode: string): string {
  return `Create a consultant-quality slide blueprint from this context:

## USER'S KEY TAKEAWAY (MUST BE THE FOCUS):
${keyTakeaway}

## RAW CONTEXT:
${context}

## ADDITIONAL DATA:
${data || 'None provided'}

## TARGET AUDIENCE:
${audience}

## PRESENTATION MODE:
${mode} (${mode === 'presentation' ? 'Minimal text, bullet points for live presenting' : 'Detailed, self-explanatory for reading'})

## SLIDE TYPE PREFERENCE:
${slideType}

---

Create a JSON blueprint following the system instructions. The slide must deliver the KEY TAKEAWAY with supporting evidence and visual structure.

Respond with valid JSON only.`;
}

function renderSlideFromBlueprint(blueprint: any, mode: string): string {
  const isPresentation = mode === 'presentation';
  
  let html = `<div class="slide-container ${blueprint.layout}">`;
  
  // Header
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  if (blueprint.subtitle) {
    html += `<p class="slide-subtitle">${blueprint.subtitle}</p>`;
  }
  html += `</div>`;
  
  // Key Message (prominent)
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  // Supporting Points
  if (blueprint.supportingPoints?.length > 0) {
    html += `<ul class="supporting-points">`;
    blueprint.supportingPoints.forEach((point: string) => {
      html += `<li>${point}</li>`;
    });
    html += `</ul>`;
  }
  
  // Data Highlights
  if (blueprint.dataHighlights?.length > 0) {
    html += `<div class="data-highlights">`;
    blueprint.dataHighlights.forEach((item: any) => {
      html += `<div class="metric">`;
      html += `<span class="number">${item.metric}</span>`;
      html += `<span class="context">${item.context}</span>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  
  // Callouts
  if (blueprint.visualElements?.calloutBoxes?.length > 0) {
    html += `<div class="callouts">`;
    blueprint.visualElements.calloutBoxes.forEach((callout: string) => {
      html += `<div class="callout">${callout}</div>`;
    });
    html += `</div>`;
  }
  
  html += `</div>`;
  
  return html;
}
