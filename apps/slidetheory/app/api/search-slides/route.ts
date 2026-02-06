import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

interface SearchRequest {
  query: string;
  filters?: {
    industry?: string;
    slide_type?: string;
    source?: string;
  };
  limit?: number;
  threshold?: number;
}

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

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
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data: EmbeddingResponse = await response.json();
  return data.data[0]?.embedding || [];
}

export async function POST(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SearchRequest = await request.json();
    
    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const {
      query,
      filters = {},
      limit = 5,
      threshold = 0.7
    } = body;

    // Check for OpenAI API key
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Search requires OPENAI_API_KEY for embeddings'
      }, { status: 500 });
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    if (queryEmbedding.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate embedding' },
        { status: 500 }
      );
    }

    // Execute search using the RPC function
    const { data: slides, error: searchError } = await supabase
      .rpc('search_similar_slides', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        filter_user_id: user.id,
        filter_industry: filters.industry || null,
        filter_slide_type: filters.slide_type || null
      });

    if (searchError) {
      console.error('Search error:', searchError);
      return NextResponse.json(
        { success: false, error: 'Search failed: ' + searchError.message },
        { status: 500 }
      );
    }

    // Format results with style guidance
    const formattedSlides = (slides || []).map((slide: Record<string, unknown>) => ({
      id: slide.id,
      title: slide.title,
      industry: slide.industry,
      slide_type: slide.slide_type,
      source: slide.source,
      layout_pattern: slide.layout_pattern,
      color_palette: slide.color_palette,
      tags: slide.tags,
      preview_url: slide.preview_url,
      content: slide.content,
      similarity: slide.similarity,
      style_guidance: {
        layout_description: (slide.layout_pattern as Record<string, unknown>)?.description || 'Standard layout',
        primary_colors: (slide.color_palette as Record<string, unknown>)?.primary || [],
        secondary_colors: (slide.color_palette as Record<string, unknown>)?.secondary || [],
        typography_style: (slide.layout_pattern as Record<string, unknown>)?.typography || 'clean, professional',
        visual_approach: (slide.slide_type as string)?.toLowerCase().includes('chart')
          ? 'data-driven visualization'
          : 'content-focused layout'
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        query,
        total_results: formattedSlides.length,
        threshold,
        slides: formattedSlides
      }
    });

  } catch (error) {
    console.error('Search slides error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
