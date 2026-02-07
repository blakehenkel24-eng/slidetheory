// Supabase Edge Function: Generate images using GPT Image 1.5
// Updated from Gemini to OpenAI's latest image model

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

serve(async (req) => {
  // Handle CORS
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
    const { prompt, size = '1792x1024', slideContext } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Enhance prompt with slide context
    let enhancedPrompt = prompt;
    if (slideContext) {
      enhancedPrompt = `${prompt}\n\nContext: ${slideContext}`;
    }

    console.log('Generating image with GPT Image 1.5...');

    // Try GPT Image 1.5 first
    let response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1.5',
        prompt: `Professional strategy consulting slide visual: ${enhancedPrompt}

Style requirements:
- Clean, minimalist business presentation aesthetic
- McKinsey/BCG/Bain consulting style
- 16:9 widescreen format
- Teal (#0d9488) as primary accent color
- White or very light gray background
- Professional data visualization, charts, or executive summary layout
- Corporate, high-end, premium feel
- Sharp typography and clear visual hierarchy`,
        size: size,
        quality: 'hd',
        style: 'vivid',
        response_format: 'b64_json',
        n: 1,
      }),
    });

    // If 1.5 fails, try gpt-image-1 as fallback
    if (!response.ok) {
      const errorText = await response.text();
      console.log('GPT Image 1.5 failed, trying gpt-image-1:', errorText);
      
      response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: `Professional consulting slide: ${enhancedPrompt}. Clean, minimalist, McKinsey-style, teal accents, white background.`,
          size: size,
          quality: 'hd',
          response_format: 'b64_json',
          n: 1,
        }),
      });
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    
    // Extract image data
    const imageData = data.data?.[0];
    
    if (!imageData || !imageData.b64_json) {
      throw new Error('No image generated');
    }

    // Return base64 image data
    return new Response(
      JSON.stringify({
        success: true,
        imageData: imageData.b64_json,
        mimeType: 'image/png',
        prompt: enhancedPrompt,
        provider: data.model || 'openai',
        revised_prompt: imageData.revised_prompt,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    console.error('Image generation error:', error);
    
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
