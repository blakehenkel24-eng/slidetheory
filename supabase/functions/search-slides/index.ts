// Supabase Edge Function: Search slides using RAG (pgvector)
// Updated to use text-embedding-3-large and better error handling

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

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
      query, 
      limit = 5, 
      match_threshold = 0.7,
      filter_industry = null,
      filter_slide_type = null
    } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let queryEmbedding: number[] | null = null;
    let embeddingError = null;

    // Generate embedding if OpenAI key available
    if (openaiApiKey) {
      try {
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-large',  // Use large model for better quality
            input: query,
            dimensions: 1536
          })
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          queryEmbedding = embeddingData.data?.[0]?.embedding;
        } else {
          const errorText = await embeddingResponse.text();
          embeddingError = `OpenAI error: ${embeddingResponse.status} - ${errorText}`;
          console.error('Embedding generation failed:', embeddingError);
        }
      } catch (e) {
        embeddingError = e.message;
        console.error('Embedding exception:', e);
      }
    } else {
      embeddingError = 'OPENAI_API_KEY not configured';
    }

    let results;
    let method = 'text';

    if (queryEmbedding) {
      // Use vector similarity search
      try {
        const { data, error } = await supabase.rpc('search_similar_slides', {
          query_embedding: queryEmbedding,
          match_threshold: match_threshold,
          match_count: limit,
          filter_industry: filter_industry,
          filter_slide_type: filter_slide_type
        });

        if (error) {
          console.error('Vector search error:', error);
          throw error;
        }
        
        results = data;
        method = 'vector';
      } catch (vectorError) {
        console.error('Vector search failed, falling back to text:', vectorError);
        // Fall through to text search
      }
    }

    // Fallback to text search if vector failed or no embedding
    if (!results) {
      try {
        const { data, error } = await supabase
          .from('slide_library')
          .select('*')
          .or(`title.ilike.%${query}%,extracted_text.ilike.%${query}%`)
          .limit(limit);

        if (error) throw error;
        results = data;
        method = 'text';
      } catch (textError) {
        console.error('Text search also failed:', textError);
        throw textError;
      }
    }

    return new Response(
      JSON.stringify({
        slides: results || [],
        count: results?.length || 0,
        method: method,
        query: query,
        filters: {
          industry: filter_industry,
          slide_type: filter_slide_type
        },
        debug: embeddingError ? { embedding_error: embeddingError } : undefined
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        slides: [],
        count: 0,
        method: 'error'
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