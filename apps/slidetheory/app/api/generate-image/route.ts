import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// GPT Image 1.5 for professional slide visuals
// Updated from Gemini to OpenAI's latest image model

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GPTImageResponse {
  b64_json?: string;
  url?: string;
  revised_prompt?: string;
}

async function generateImageWithGPT(prompt: string): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    console.log('OPENAI_API_KEY not configured');
    return null;
  }

  try {
    // Use GPT Image 1.5 for high-quality slide visuals
    const response = await openai.images.generate({
      model: "gpt-image-1.5", // or "gpt-image-1" depending on availability
      prompt: `Professional strategy consulting slide visual: ${prompt}

Style requirements:
- Clean, minimalist business presentation aesthetic
- McKinsey/BCG/Bain consulting style
- 16:9 widescreen format
- Teal (#0d9488) as primary accent color (matching the new design)
- White or very light gray background
- Professional data visualization, charts, or executive summary layout
- Corporate, high-end, premium feel
- Sharp typography and clear visual hierarchy
- No text, focus on visual elements, charts, graphics only`,
      size: "1792x1024", // 16:9 aspect ratio closest option
      quality: "hd",
      style: "vivid",
      response_format: "b64_json",
      n: 1,
    });

    const imageData = response.data[0] as GPTImageResponse;
    
    if (imageData.b64_json) {
      return `data:image/png;base64,${imageData.b64_json}`;
    }
    
    if (imageData.url) {
      return imageData.url;
    }

    console.log('No image data in response:', response);
    return null;

  } catch (error) {
    console.error('GPT Image 1.5 generation error:', error);
    
    // Fallback to gpt-image-1 if 1.5 isn't available yet
    try {
      console.log('Falling back to gpt-image-1...');
      const fallbackResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Professional strategy consulting slide: ${prompt}. Clean, minimalist, McKinsey-style, teal accents on white background, 16:9 format.`,
        size: "1792x1024",
        quality: "hd",
        response_format: "b64_json",
        n: 1,
      });
      
      const fallbackData = fallbackResponse.data[0] as GPTImageResponse;
      if (fallbackData.b64_json) {
        return `data:image/png;base64,${fallbackData.b64_json}`;
      }
    } catch (fallbackError) {
      console.error('Fallback image generation also failed:', fallbackError);
    }
    
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, slideId, slideContext } = body;

    if (!prompt || !slideId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt and slideId'
      }, { status: 400 });
    }

    // Enhance prompt with slide context if provided
    let enhancedPrompt = prompt;
    if (slideContext) {
      enhancedPrompt = `${prompt}\n\nContext: ${slideContext}`;
    }

    // Try to generate with GPT Image 1.5
    console.log('Generating image with GPT Image 1.5...');
    const imageUrl = await generateImageWithGPT(enhancedPrompt);
    
    if (imageUrl) {
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
        generated: true,
        provider: 'openai-gpt-image-1.5',
        prompt: enhancedPrompt,
      });
    }

    // Fallback to placeholder if generation fails
    console.log('Using placeholder image (GPT Image unavailable)');
    const placeholderSvg = generatePlaceholderSVG(prompt);
    
    return NextResponse.json({
      success: true,
      imageUrl: placeholderSvg,
      generated: false,
      note: 'Using placeholder image. Check OPENAI_API_KEY configuration.',
      prompt: enhancedPrompt,
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Image generation failed',
    }, { status: 500 });
  }
}

function generatePlaceholderSVG(prompt: string): string {
  // Create a professional-looking SVG placeholder
  const encodedPrompt = prompt.slice(0, 40).replace(/"/g, '&quot;');
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1792" height="1024" viewBox="0 0 1792 1024">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f8fafc"/>
        <stop offset="100%" style="stop-color:#f1f5f9"/>
      </linearGradient>
    </defs>
    <rect width="1792" height="1024" fill="url(#bg)"/>
    <rect x="80" y="80" width="1632" height="864" fill="white" stroke="#e2e8f0" stroke-width="2" rx="16"/>
    
    <!-- Decorative elements -->
    <rect x="120" y="120" width="200" height="24" fill="#0d9488" rx="4"/>
    <rect x="120" y="160" width="400" height="16" fill="#cbd5e1" rx="2"/>
    <rect x="120" y="184" width="350" height="16" fill="#cbd5e1" rx="2"/>
    
    <!-- Chart placeholder -->
    <rect x="120" y="240" width="600" height="400" fill="#f8fafc" stroke="#e2e8f0" rx="8"/>
    <rect x="140" y="580" width="80" height="40" fill="#0d9488" rx="4" opacity="0.8"/>
    <rect x="240" y="540" width="80" height="80" fill="#14b8a6" rx="4" opacity="0.8"/>
    <rect x="340" y="500" width="80" height="120" fill="#0d9488" rx="4" opacity="0.8"/>
    <rect x="440" y="460" width="80" height="160" fill="#14b8a6" rx="4" opacity="0.8"/>
    
    <!-- Right side content -->
    <rect x="800" y="240" width="400" height="16" fill="#0f172a" rx="2"/>
    <rect x="800" y="272" width="350" height="12" fill="#64748b" rx="2"/>
    <rect x="800" y="296" width="380" height="12" fill="#64748b" rx="2"/>
    <rect x="800" y="320" width="320" height="12" fill="#64748b" rx="2"/>
    
    <!-- Key metrics -->
    <rect x="800" y="380" width="150" height="80" fill="#f0fdfa" stroke="#ccfbf1" rx="8"/>
    <rect x="970" y="380" width="150" height="80" fill="#f0fdfa" stroke="#ccfbf1" rx="8"/>
    <rect x="1140" y="380" width="150" height="80" fill="#f0fdfa" stroke="#ccfbf1" rx="8"/>
    
    <!-- Footer text -->
    <text x="896" y="800" font-family="system-ui, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">${encodedPrompt}...</text>
    <text x="896" y="840" font-family="system-ui, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">Generated by SlideTheory • Set OPENAI_API_KEY for AI images</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
