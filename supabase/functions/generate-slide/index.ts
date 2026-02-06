// Supabase Edge Function: Generate structured slide blueprint
// Uses McKinsey/BCG/Bain consulting standards

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SYSTEM_PROMPT = `You are an elite strategy consultant who spent 20 years at McKinsey, Bain, and BCG.

## YOUR TASK
Transform raw context into a structured, consultant-quality slide blueprint that follows industry best practices.

## THE PYRAMID PRINCIPLE (MANDATORY)
Structure every slide top-down:
1. MAIN POINT (Title): The key takeaway/insight
2. KEY ARGUMENTS: 2-4 supporting pillars (MECE - mutually exclusive, collectively exhaustive)
3. SUPPORTING DATA: Evidence for each argument

Every element must support the element above it. Nothing in the title should not be in the body.

## ACTION TITLES (CRITICAL)
The title MUST be action-oriented, NOT descriptive.

BAD: "Revenue Analysis" or "Market Overview"
GOOD: "Revenue growth accelerated to 15% driven by digital transformation"

Formula: [Subject] + [Action/Change] + [Key Driver/Result]
- Must be a complete sentence
- Must articulate the "so what?"
- Must include the insight, not just the topic
- 5-12 words ideally
- Answers: "What should the audience know/understand/do?"

## SLIDE LAYOUT SELECTION
Choose the layout that best fits the story:

EXECUTIVE-SUMMARY: High-level overview, 3-4 key bullets, big picture chart
- Use for: Opening slides, summaries, recommendations

ISSUE-TREE: Hierarchical breakdown of complex problems
- Use for: Problem diagnosis, root cause analysis
- Structure: Root problem → 2-4 branches → sub-branches

2X2-MATRIX: Compare options on two dimensions
- Use for: Strategic positioning, portfolio analysis
- Structure: X-axis, Y-axis, 4 quadrants with implications

WATERFALL: Show progression or breakdown
- Use for: Financial bridges, variance explanations
- Structure: Start value → steps → end value

COMPARISON: Side-by-side option analysis
- Use for: Option evaluation, vendor selection
- Structure: Columns for options, rows for criteria

PROCESS-FLOW: Step-by-step workflows
- Use for: Operating models, implementation plans
- Structure: Sequential steps with arrows

## MECE PRINCIPLE (MANDATORY)
All categories must be:
- Mutually Exclusive: No overlap between categories
- Collectively Exhaustive: No gaps, covers all possibilities

Example of MECE categories:
✓ By customer segment, by channel, by geography
✗ By product AND by geography (products exist in multiple geos)

## DATA STANDARDS
1. Lead with the insight, not the data
2. Format numbers consistently (K/M/B for large numbers)
3. Show "so what?" for every metric
4. Use percentages with base sizes
5. Always include sources

## OUTPUT FORMAT - JSON ONLY:
{
  "title": "Action-oriented slide title with insight (5-12 words)",
  "subtitle": "Supporting context if needed (optional, 10-15 words)",
  "layout": "executive-summary | issue-tree | 2x2-matrix | waterfall | process-flow | comparison",
  "keyMessage": "The single most important takeaway (1 sentence with so-what)",
  "supportingPoints": [
    "Point 1: Specific insight with data AND so-what",
    "Point 2: Specific insight with data AND so-what",
    "Point 3: Specific insight with data AND so-what"
  ],
  "dataHighlights": [
    {"metric": "Formatted number", "context": "What it means / why it matters"}
  ],
  "chartRecommendation": {
    "type": "bar | line | pie | waterfall | none",
    "title": "Chart insight (not just description)",
    "data": "What data to show"
  },
  "visualElements": {
    "calloutBoxes": ["Key insight 1", "Key insight 2"],
    "icons": ["relevant metaphorical icons"]
  },
  "structureRationale": "Why this layout was chosen for this content",
  "imagePrompt": "Detailed prompt for image generation"
}

## CONSULTING LANGUAGE STANDARDS
Use: Accelerate, capture, leverage, unlock, drive, strategic imperative, evidence shows
Avoid: Try, attempt, maybe, obviously, very, really (weak words)

## CRITICAL RULES
1. SO WHAT? Every point must answer this.
2. No descriptive titles - only action titles.
3. MECE structure throughout.
4. Data without insight is worthless - always explain what it means.
5. Be specific and defensible - no generic business speak.
6. Create NEW insights from the context, don't just reword it.

## QUALITY CHECK
Before outputting, verify:
- [ ] Title is action-oriented with clear insight
- [ ] Layout choice matches the story type
- [ ] Supporting points are MECE
- [ ] Every metric has a "so what?"
- [ ] Pyramid principle followed (top-down)`;

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

    // STEP 1: Analyze content to recommend best layout
    const layoutRecommendation = recommendLayout(context, keyTakeaway, data, slideType);

    // STEP 2: Create structured blueprint with OpenAI
    const blueprintPrompt = buildBlueprintPrompt(context, keyTakeaway, slideType, audience, data, presentationMode, layoutRecommendation);
    
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

function recommendLayout(context: string, keyTakeaway: string, data: string, slideType: string): string {
  // Logic to recommend best layout based on content
  const text = (context + ' ' + keyTakeaway + ' ' + data).toLowerCase();
  
  if (slideType !== 'auto-select') return slideType;
  
  // Check for patterns that suggest specific layouts
  if (text.includes('compared to') || text.includes('versus') || text.includes('vs')) {
    return 'comparison';
  }
  if (text.includes('breakdown') || text.includes('broken into') || text.includes('categories')) {
    return 'issue-tree';
  }
  if (text.includes('over time') || text.includes('trend') || text.includes('growth') || text.includes('decline')) {
    return 'executive-summary'; // Usually with a trend chart
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
  
  return 'executive-summary'; // Default
}

function buildBlueprintPrompt(context: string, keyTakeaway: string, slideType: string, audience: string, data: string, mode: string, recommendedLayout: string): string {
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

## RECOMMENDED LAYOUT:
${recommendedLayout}
${recommendedLayout !== slideType && slideType !== 'auto-select' ? `(User prefers: ${slideType})` : ''}

---

Create a JSON blueprint following the system instructions.

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
  
  // Layout-specific rendering
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
  
  // Header with action title
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  if (blueprint.subtitle) {
    html += `<p class="slide-subtitle">${blueprint.subtitle}</p>`;
  }
  html += `</div>`;
  
  // Key message box (prominent)
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  // Supporting points
  if (blueprint.supportingPoints?.length > 0) {
    html += `<div class="supporting-section">`;
    html += `<h3 class="section-label">Key Insights:</h3>`;
    html += `<ul class="supporting-points">`;
    blueprint.supportingPoints.forEach((point: string) => {
      html += `<li>${point}</li>`;
    });
    html += `</ul></div>`;
  }
  
  // Data highlights in grid
  if (blueprint.dataHighlights?.length > 0) {
    html += `<div class="data-section">`;
    html += `<h3 class="section-label">Key Metrics:</h3>`;
    html += `<div class="data-highlights">`;
    blueprint.dataHighlights.forEach((item: any) => {
      html += `<div class="metric">`;
      html += `<span class="number">${item.metric}</span>`;
      html += `<span class="context">${item.context}</span>`;
      html += `</div>`;
    });
    html += `</div></div>`;
  }
  
  // Callout boxes for key insights
  if (blueprint.visualElements?.calloutBoxes?.length > 0) {
    html += `<div class="callouts-section">`;
    blueprint.visualElements.calloutBoxes.forEach((callout: string) => {
      html += `<div class="callout">${callout}</div>`;
    });
    html += `</div>`;
  }
  
  // Layout rationale (for transparency)
  if (blueprint.structureRationale) {
    html += `<div class="rationale-note">${blueprint.structureRationale}</div>`;
  }
  
  html += `</div>`;
  
  return html;
}

function renderIssueTree(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container issue-tree">`;
  
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  // Issue tree structure
  html += `<div class="tree-container">`;
  html += `<div class="tree-root">Problem: ${blueprint.title}</div>`;
  
  if (blueprint.supportingPoints?.length > 0) {
    html += `<div class="tree-branches">`;
    blueprint.supportingPoints.forEach((point: string, index: number) => {
      html += `<div class="tree-branch">`;
      html += `<div class="branch-label">${String.fromCharCode(65 + index)}. ${point}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  
  html += `</div></div>`;
  return html;
}

function render2x2Matrix(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container matrix-2x2">`;
  
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  html += `<div class="matrix-grid">`;
  html += `<div class="matrix-quadrant q1">High Growth / High Share</div>`;
  html += `<div class="matrix-quadrant q2">High Growth / Low Share</div>`;
  html += `<div class="matrix-quadrant q3">Low Growth / High Share</div>`;
  html += `<div class="matrix-quadrant q4">Low Growth / Low Share</div>`;
  html += `</div>`;
  
  html += `</div>`;
  return html;
}

function renderWaterfall(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container waterfall">`;
  
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  html += `<div class="waterfall-chart">`;
  html += `<div class="waterfall-bars">`;
  if (blueprint.dataHighlights?.length > 0) {
    blueprint.dataHighlights.forEach((item: any, index: number) => {
      const isPositive = !item.metric.includes('-') && !item.context.toLowerCase().includes('decrease');
      html += `<div class="waterfall-bar ${isPositive ? 'positive' : 'negative'}">`;
      html += `<span class="bar-label">${item.metric}</span>`;
      html += `<span class="bar-context">${item.context}</span>`;
      html += `</div>`;
    });
  }
  html += `</div></div>`;
  
  html += `</div>`;
  return html;
}

function renderComparison(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container comparison">`;
  
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  html += `<div class="comparison-table">`;
  html += `<div class="comparison-row header">`;
  html += `<div class="comparison-cell">Criteria</div>`;
  html += `<div class="comparison-cell">Option A</div>`;
  html += `<div class="comparison-cell">Option B</div>`;
  html += `</div>`;
  
  if (blueprint.supportingPoints?.length > 0) {
    blueprint.supportingPoints.forEach((point: string) => {
      html += `<div class="comparison-row">`;
      html += `<div class="comparison-cell">${point}</div>`;
      html += `<div class="comparison-cell">✓</div>`;
      html += `<div class="comparison-cell">—</div>`;
      html += `</div>`;
    });
  }
  
  html += `</div></div>`;
  return html;
}

function renderProcessFlow(blueprint: any, isPresentation: boolean): string {
  let html = `<div class="slide-container process-flow">`;
  
  html += `<div class="slide-header">`;
  html += `<h1 class="slide-title">${blueprint.title}</h1>`;
  html += `</div>`;
  
  if (blueprint.keyMessage) {
    html += `<div class="key-message-box">${blueprint.keyMessage}</div>`;
  }
  
  html += `<div class="process-steps">`;
  if (blueprint.supportingPoints?.length > 0) {
    blueprint.supportingPoints.forEach((point: string, index: number) => {
      html += `<div class="process-step">`;
      html += `<div class="step-number">${index + 1}</div>`;
      html += `<div class="step-content">${point}</div>`;
      html += `</div>`;
    });
  }
  html += `</div></div>`;
  return html;
}
