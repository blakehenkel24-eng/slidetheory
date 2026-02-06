// Supabase Edge Function: Generate slide image from blueprint
// Uses Gemini 2.0 Flash for image generation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    const { blueprint, style = 'corporate' } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Build comprehensive image prompt from blueprint
    const imagePrompt = buildImagePrompt(blueprint, style);

    // Generate with Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: imagePrompt }]
          }],
          generationConfig: {
            responseModalities: ["Text", "Image"]
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini error: ${error}`);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    
    if (!imagePart) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No image generated',
          prompt: imagePrompt 
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

    return new Response(
      JSON.stringify({
        success: true,
        imageData: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        prompt: imagePrompt,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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

function buildImagePrompt(blueprint: any, style: string): string {
  const layout = blueprint.layout || 'executive-summary';
  const title = blueprint.title || 'Slide Title';
  const keyMessage = blueprint.keyMessage || '';
  
  // Style modifiers
  const styles: Record<string, string> = {
    corporate: 'clean, minimalist, McKinsey-style, white background, navy blue accents, professional typography',
    modern: 'sleek, gradient accents, modern sans-serif, light gray background, subtle shadows',
    bold: 'high contrast, bold colors, impactful visuals, dark mode compatible',
    minimal: 'extremely minimal, lots of white space, single accent color, elegant'
  };

  const styleDesc = styles[style] || styles.corporate;

  // Layout-specific instructions
  const layoutVisuals: Record<string, string> = {
    'executive-summary': 'title at top, key message prominently displayed in center, supporting metrics as large numbers, minimal text',
    'issue-tree': 'hierarchical tree structure branching from top, clear parent-child relationships, logical flow downward',
    '2x2-matrix': 'quadrant layout with axes labeled, content in each quadrant, clear differentiation between sections',
    'waterfall': 'waterfall chart showing progression, starting point on left, incremental steps, final result on right',
    'process-flow': 'horizontal or vertical flow diagram, arrows connecting steps, clear sequence, numbered stages',
    'comparison': 'side-by-side comparison layout, clear column headers, contrasting elements highlighted'
  };

  const layoutDesc = layoutVisuals[layout] || layoutVisuals['executive-summary'];

  return `Create a professional consulting slide visualization with this exact structure:

TITLE: "${title}"
KEY MESSAGE: "${keyMessage}"
LAYOUT TYPE: ${layout}

VISUAL REQUIREMENTS:
- ${styleDesc}
- ${layoutDesc}
- 16:9 aspect ratio slide format
- Clean, uncluttered design
- Professional business presentation style
- Easy to read from a distance

CONTENT TO VISUALIZE:
${blueprint.supportingPoints?.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n') || 'Supporting points will be added separately'}

The image should look like a finished slide from a top-tier consulting firm presentation, ready to present to C-suite executives.`;
}
