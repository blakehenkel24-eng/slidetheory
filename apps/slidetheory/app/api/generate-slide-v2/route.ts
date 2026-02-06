import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

console.log('[generate-slide-v2] Route initialized');

const SYSTEM_PROMPT = `You are an expert strategy consultant who creates McKinsey/BCG-quality slide content.

Generate professional slide content following these principles:
- MECE: Mutually Exclusive, Collectively Exhaustive organization
- Pyramid Principle: Lead with the "so-what", support with evidence
- Executive-level tone: Clear, concise, action-oriented
- Visual clarity: Every element serves a purpose

Respond with a JSON object containing:
- headline: Action-oriented headline (5-8 words, front-loads the insight)
- subheadline: Optional supporting context (max 10 words)
- content: Object with primary_message and bullet_points array
- supporting_elements: Array of metrics or key data points

Keep bullets under 12 words each, use parallel structure, and front-load insights.`;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface AIProvider {
  name: string;
  generate: (prompt: string) => Promise<string>;
}

function getAIProvider(): AIProvider | null {
  console.log('[generate-slide-v2] Checking AI providers...');
  
  // Try Kimi first (preferred for this application)
  const kimiKey = process.env.KIMI_API_KEY;
  console.log('[generate-slide-v2] KIMI_API_KEY available:', !!kimiKey);
  
  if (kimiKey) {
    return {
      name: 'kimi',
      generate: async (userPrompt: string) => {
        const openai = new OpenAI({
          apiKey: kimiKey,
          baseURL: process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1',
        });
        
        console.log('[generate-slide-v2] Calling Kimi API...');
        const completion = await openai.chat.completions.create({
          model: 'moonshot-v1-128k',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });
        
        const content = completion.choices[0].message.content || '';
        console.log('[generate-slide-v2] Kimi response received, length:', content.length);
        return content;
      }
    };
  }

  // Try OpenAI as fallback
  const openaiKey = process.env.OPENAI_API_KEY;
  console.log('[generate-slide-v2] OPENAI_API_KEY available:', !!openaiKey);
  
  if (openaiKey) {
    return {
      name: 'openai',
      generate: async (userPrompt: string) => {
        const openai = new OpenAI({
          apiKey: openaiKey,
        });
        
        console.log('[generate-slide-v2] Calling OpenAI API...');
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });
        
        const content = completion.choices[0].message.content || '';
        console.log('[generate-slide-v2] OpenAI response received, length:', content.length);
        return content;
      }
    };
  }

  console.error('[generate-slide-v2] No AI provider configured');
  return null;
}

/**
 * Fetch RAG context from Supabase slide_library
 */
async function fetchRAGContext(query: string, slideType?: string, audience?: string): Promise<string> {
  console.log('[generate-slide-v2] Fetching RAG context for query:', query.substring(0, 50) + '...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('[generate-slide-v2] Supabase not configured, skipping RAG');
    return '';
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Build the query
    let dbQuery = supabase
      .from('slide_library')
      .select('headline, content, slide_type, audience, visual_style');

    // Apply filters
    if (slideType && slideType !== 'auto') {
      dbQuery = dbQuery.eq('slide_type', slideType);
    }

    if (audience && audience !== 'auto') {
      dbQuery = dbQuery.eq('audience', audience);
    }

    // Search by text similarity
    const searchTerm = `%${query}%`;
    const { data, error } = await dbQuery
      .or(`headline.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(3);

    if (error) {
      console.error('[generate-slide-v2] RAG query error:', error);
      return '';
    }

    if (!data || data.length === 0) {
      console.log('[generate-slide-v2] No RAG context found');
      return '';
    }

    console.log(`[generate-slide-v2] Found ${data.length} RAG examples`);

    // Format RAG context
    const context = data.map((slide, idx) => 
      `Example ${idx + 1} (${slide.slide_type}, ${slide.audience}):\nHeadline: ${slide.headline}\nContent: ${slide.content}`
    ).join('\n\n');

    return `\n\nReference slide examples for style guidance:\n${context}\n`;

  } catch (error) {
    console.error('[generate-slide-v2] RAG fetch error:', error);
    return '';
  }
}

/**
 * Parse AI response to extract JSON
 */
function parseAIResponse(aiContent: string, keyTakeaway: string, slideType: string): any {
  console.log('[generate-slide-v2] Parsing AI response...');
  
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)```/) || 
                      aiContent.match(/```\s*([\s\S]*?)```/) ||
                      [null, aiContent];
    const jsonStr = jsonMatch[1]?.trim() || aiContent.trim();
    
    // Find JSON object boundaries
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const parsed = JSON.parse(jsonStr.slice(jsonStart, jsonEnd));
      console.log('[generate-slide-v2] JSON parsed successfully');
      return parsed;
    }
    
    throw new Error('No JSON object found in response');
  } catch (parseError) {
    console.error('[generate-slide-v2] JSON parse error:', parseError);
    console.log('[generate-slide-v2] Raw response:', aiContent.substring(0, 500));
    
    // Create structured content from text as fallback
    return {
      headline: keyTakeaway,
      subheadline: slideType === 'auto' ? 'Strategic Analysis' : slideType,
      content: {
        primary_message: keyTakeaway,
        bullet_points: aiContent.split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
          .slice(0, 4)
          .map(line => line.replace(/^[\s\-\•]+/, '').trim())
      }
    };
  }
}

export async function POST(request: NextRequest) {
  console.log('[generate-slide-v2] POST request received');
  
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[generate-slide-v2] Request body:', {
        slideType: body.slideType,
        audience: body.audience,
        contextLength: body.context?.length,
        keyTakeaway: body.keyTakeaway?.substring(0, 50)
      });
    } catch (parseError) {
      console.error('[generate-slide-v2] Failed to parse request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid request body: Expected JSON',
        code: 'INVALID_JSON'
      }, { status: 400 });
    }
    
    const { slideType, context, audience, keyTakeaway, presentationMode, dataInput } = body;

    // Validate required fields
    if (!slideType || !context || context.length < 10) {
      console.error('[generate-slide-v2] Validation failed: missing slideType or context');
      return NextResponse.json({ 
        success: false,
        error: 'Invalid input: slideType and context (min 10 chars) required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    if (!keyTakeaway || keyTakeaway.length < 5) {
      console.error('[generate-slide-v2] Validation failed: missing keyTakeaway');
      return NextResponse.json({
        success: false,
        error: 'Invalid input: keyTakeaway (min 5 chars) required',
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    // Get AI provider
    const provider = getAIProvider();
    
    if (!provider) {
      console.error('[generate-slide-v2] No AI provider available');
      return NextResponse.json({
        success: false,
        error: 'AI service not configured. Set KIMI_API_KEY or OPENAI_API_KEY environment variable.',
        code: 'CONFIG_ERROR'
      }, { status: 503 });
    }

    console.log(`[generate-slide-v2] Using AI provider: ${provider.name}`);

    // Fetch RAG context from Supabase
    const ragContext = await fetchRAGContext(
      `${slideType} ${keyTakeaway} ${context}`,
      slideType,
      audience
    );

    // Build the prompt
    const userPrompt = `Create a ${slideType === 'auto' ? 'consulting' : slideType} slide for ${audience === 'auto' ? 'executives' : audience}.

Context: ${context}

Key Takeaway: ${keyTakeaway}

Presentation Mode: ${presentationMode || 'presentation'}

${dataInput ? `Data Provided:\n${dataInput}\n\n` : ''}
${ragContext}

Generate the slide content as a JSON object with:
- headline: Compelling action-oriented headline
- subheadline: Supporting context
- content.primary_message: The main insight
- content.bullet_points: Array of 3-4 concise bullet points
- supporting_elements: Array of key metrics/data points`;

    console.log('[generate-slide-v2] Sending prompt to AI...');

    // Call AI provider
    let aiContent: string;
    try {
      aiContent = await provider.generate(userPrompt);
    } catch (aiError) {
      console.error(`[generate-slide-v2] ${provider.name} API error:`, aiError);
      
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown API error';
      
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        return NextResponse.json({
          success: false,
          error: 'AI generation quota exceeded. Please try again later.',
          code: 'QUOTA_EXCEEDED'
        }, { status: 429 });
      }
      
      if (errorMessage.includes('permission') || errorMessage.includes('403') || errorMessage.includes('401')) {
        console.error('[generate-slide-v2] API Key Error:', errorMessage);
        return NextResponse.json({
          success: false,
          error: `Invalid ${provider.name} API key or insufficient permissions. Please check your API key in Vercel environment variables.`,
          code: 'PERMISSION_DENIED',
          details: errorMessage
        }, { status: 403 });
      }

      return NextResponse.json({
        success: false,
        error: `AI generation failed: ${errorMessage}`,
        code: 'AI_ERROR'
      }, { status: 500 });
    }

    // Parse AI response
    const parsedContent = parseAIResponse(aiContent, keyTakeaway, slideType);

    // Generate HTML content for the slide preview
    const htmlContent = generateSlideHTML(parsedContent);

    // Generate placeholder image URL for the slide
    const imageUrl = generatePlaceholderImage(parsedContent);

    // Create the slide data object
    const now = new Date().toISOString();
    const slide = {
      id: crypto.randomUUID(),
      slideType: slideType || 'General',
      audience: audience || 'auto',
      context: context,
      keyTakeaway: keyTakeaway,
      presentationMode: presentationMode || 'presentation',
      dataInput: dataInput,
      htmlContent: htmlContent,
      imageUrl: imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    console.log('[generate-slide-v2] Slide generated successfully:', slide.id);

    return NextResponse.json({
      success: true,
      slide: slide,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('[generate-slide-v2] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

function generateSlideHTML(content: unknown) {
  const headline = (content as Record<string, unknown>).headline || (content as Record<string, unknown>).title || 'Strategic Insights';
  const subheadline = (content as Record<string, unknown>).subheadline || '';
  const contentObj = (content as Record<string, unknown>).content as Record<string, unknown> || {};
  const primaryMessage = contentObj.primary_message || '';
  const bullets = (contentObj.bullet_points || []) as string[];
  const supporting = ((content as Record<string, unknown>).supporting_elements || []) as Array<{label?: string; value?: string}>;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: white;
      color: #1a1a1a;
      line-height: 1.5;
    }
    .slide-container {
      width: 100%;
      height: 100%;
      padding: 48px 60px;
      display: flex;
      flex-direction: column;
    }
    .slide-header {
      border-bottom: 3px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .slide-title {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .slide-subtitle {
      font-size: 16px;
      color: #64748b;
    }
    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .primary-message {
      background: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 16px 20px;
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }
    .bullet-points {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .bullet-point {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 15px;
      color: #334155;
    }
    .bullet-point::before {
      content: "";
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      margin-top: 7px;
      flex-shrink: 0;
    }
    .supporting-elements {
      display: flex;
      gap: 16px;
      margin-top: auto;
    }
    .metric-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      flex: 1;
    }
    .metric-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="slide-container">
    <div class="slide-header">
      <h1 class="slide-title">${escapeHtml(String(headline))}</h1>
      ${subheadline ? `<p class="slide-subtitle">${escapeHtml(String(subheadline))}</p>` : ''}
    </div>
    <div class="slide-content">
      ${primaryMessage ? `<div class="primary-message">${escapeHtml(String(primaryMessage))}</div>` : ''}
      ${bullets.length > 0 ? `
      <div class="bullet-points">
        ${bullets.map((b: string) => `<div class="bullet-point">${escapeHtml(b.replace(/^[\s\-\•]+/, '').trim())}</div>`).join('')}
      </div>` : ''}
      ${supporting.length > 0 ? `
      <div class="supporting-elements">
        ${supporting.map((s) => `
          <div class="metric-box">
            <div class="metric-label">${escapeHtml(s.label || 'Metric')}</div>
            <div class="metric-value">${escapeHtml(s.value || '')}</div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

function generatePlaceholderImage(content: unknown): string {
  const headline = (content as Record<string, unknown>).headline || 'Slide';
  const subheadline = (content as Record<string, unknown>).subheadline || '';
  const encodedHeadline = String(headline).slice(0, 40).replace(/"/g, '&quot;');
  const encodedSub = String(subheadline).slice(0, 30).replace(/"/g, '&quot;');
  
  // Create a visually appealing placeholder SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f8fafc"/>
        <stop offset="100%" style="stop-color:#e2e8f0"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#3b82f6"/>
        <stop offset="100%" style="stop-color:#60a5fa"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect x="60" y="40" width="680" height="6" fill="#0f172a"/>
    <text x="60" y="100" font-family="Segoe UI, system-ui, sans-serif" font-size="28" font-weight="700" fill="#0f172a">${encodedHeadline}</text>
    ${encodedSub ? `<text x="60" y="135" font-family="Segoe UI, system-ui, sans-serif" font-size="14" fill="#64748b">${encodedSub}</text>` : ''}
    <rect x="60" y="170" width="8" height="80" fill="url(#accent)" rx="2"/>
    <text x="80" y="195" font-family="Segoe UI, system-ui, sans-serif" font-size="14" font-weight="600" fill="#0f172a">Key Insight</text>
    <text x="80" y="220" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="#475569">Strategic analysis and recommendations based on</text>
    <text x="80" y="238" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="#475569">market research and competitive intelligence.</text>
    <circle cx="76" cy="290" r="4" fill="#3b82f6"/>
    <text x="90" y="295" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="#334155">Data-driven insights for executive decision making</text>
    <circle cx="76" cy="315" r="4" fill="#3b82f6"/>
    <text x="90" y="320" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="#334155">Structured analysis following MECE principles</text>
    <rect x="60" y="360" width="200" height="60" fill="#f1f5f9" stroke="#e2e8f0" rx="6"/>
    <text x="80" y="385" font-family="Segoe UI, system-ui, sans-serif" font-size="10" fill="#64748b" text-transform="uppercase">GROWTH</text>
    <text x="80" y="408" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="#0f172a">25%</text>
    <rect x="280" y="360" width="200" height="60" fill="#f1f5f9" stroke="#e2e8f0" rx="6"/>
    <text x="300" y="385" font-family="Segoe UI, system-ui, sans-serif" font-size="10" fill="#64748b" text-transform="uppercase">MARKET</text>
    <text x="300" y="408" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="#0f172a">$2.4B</text>
    <rect x="500" y="360" width="200" height="60" fill="#f1f5f9" stroke="#e2e8f0" rx="6"/>
    <text x="520" y="385" font-family="Segoe UI, system-ui, sans-serif" font-size="10" fill="#64748b" text-transform="uppercase">TIMELINE</text>
    <text x="520" y="408" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="700" fill="#0f172a">Q3 2026</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  const str = typeof text === 'string' ? text : String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Health check endpoint
export async function GET() {
  console.log('[generate-slide-v2] GET health check received');
  
  const kimiKey = process.env.KIMI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    success: true,
    status: 'healthy',
    config: {
      kimiApiKey: !!kimiKey,
      openaiApiKey: !!openaiKey,
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
      timestamp: new Date().toISOString()
    }
  });
}
