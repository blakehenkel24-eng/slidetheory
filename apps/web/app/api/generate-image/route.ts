import { NextRequest, NextResponse } from 'next/server';

// Nano Banana Pro image generation using Gemini API
// This generates professional slide images using AI

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}

async function generateImageWithGemini(prompt: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    console.log('GEMINI_API_KEY not configured');
    return null;
  }

  try {
    // Use Gemini 2.0 Flash for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a professional consulting slide image for: ${prompt}

Requirements:
- Clean, professional business presentation style
- 16:9 aspect ratio format
- McKinsey/BCG consulting aesthetic
- Use blue (#3b82f6) as primary accent color
- White/light background
- Minimal, data-driven design
- Include placeholder for charts, metrics, or key insights
- Executive-level visual clarity`
            }]
          }],
          generationConfig: {
            responseModalities: ['Text', 'Image']
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', response.status, error);
      return null;
    }

    const data: GeminiResponse = await response.json();
    
    // Extract image from response
    const inlineData = data.candidates?.[0]?.content?.parts?.find(
      part => part.inlineData
    )?.inlineData;

    if (inlineData?.data) {
      return `data:${inlineData.mimeType};base64,${inlineData.data}`;
    }

    return null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, slideId } = body;

    if (!prompt || !slideId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt and slideId'
      }, { status: 400 });
    }

    // Try to generate with Gemini first
    const imageUrl = await generateImageWithGemini(prompt);
    
    if (imageUrl) {
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
        generated: true,
        provider: 'gemini'
      });
    }

    // Fallback to placeholder if generation fails or no API key
    console.log('Using placeholder image (Gemini unavailable)');
    const placeholderSvg = generatePlaceholderSVG(prompt);
    
    return NextResponse.json({
      success: true,
      imageUrl: placeholderSvg,
      generated: false,
      note: 'Using placeholder image. Set GEMINI_API_KEY for real image generation.'
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
  // Create a simple SVG placeholder image
  const encodedPrompt = prompt.slice(0, 50).replace(/"/g, '&quot;');
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <rect width="800" height="450" fill="#f8fafc"/>
    <rect x="40" y="40" width="720" height="370" fill="white" stroke="#e2e8f0" stroke-width="2" rx="8"/>
    <text x="400" y="200" font-family="system-ui, sans-serif" font-size="24" fill="#64748b" text-anchor="middle">Slide Image</text>
    <text x="400" y="240" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">${encodedPrompt}...</text>
    <text x="400" y="280" font-family="system-ui, sans-serif" font-size="12" fill="#cbd5e1" text-anchor="middle">Set GEMINI_API_KEY to enable image generation</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
