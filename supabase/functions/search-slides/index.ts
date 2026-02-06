// Supabase Edge Function: search-slides
// Semantic search for slide library using vector embeddings

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

interface SearchRequest {
  query: string;
  filters?: {
    industry?: string;
    slide_type?: string;
    source?: string;
    user_id?: string;
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

function buildSearchContext(slide: Record<string, unknown>): string {
  const parts: string[] = [];
  
  if (slide.title) parts.push(`Title: ${slide.title}`);
  if (slide.industry) parts.push(`Industry: ${slide.industry}`);
  if (slide.slide_type) parts.push(`Type: ${slide.slide_type}`);
  if (slide.tags && Array.isArray(slide.tags)) parts.push(`Tags: ${slide.tags.join(', ')}`);
  if (slide.extracted_text) parts.push(`Content: ${slide.extracted_text}`);
  
  return parts.join('\n');
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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
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

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: SearchRequest = await req.json();
    
    // Validate required fields
    if (!body.query || body.query.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      query,
      filters = {},
      limit = 5,
      threshold = 0.7
    } = body;

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    if (queryEmbedding.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate embedding' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build the query
    let dbQuery = supabase
      .rpc('search_similar_slides', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        filter_user_id: filters.user_id || user.id,
        filter_industry: filters.industry || null,
        filter_slide_type: filters.slide_type || null
      });

    // Execute search
    const { data: slides, error: searchError } = await dbQuery;

    if (searchError) {
      console.error('Search error:', searchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Search failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
      // Provide style guidance for generation
      style_guidance: {
        layout_description: slide.layout_pattern?.description || 'Standard layout',
        primary_colors: slide.color_palette?.primary || [],
        secondary_colors: slide.color_palette?.secondary || [],
        typography_style: slide.layout_pattern?.typography || 'clean, professional',
        visual_approach: slide.slide_type?.toLowerCase().includes('chart') 
          ? 'data-driven visualization' 
          : 'content-focused layout'
      }
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          query,
          total_results: formattedSlides.length,
          threshold,
          slides: formattedSlides
        }
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
    console.error('Search slides error:', error);
    
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
