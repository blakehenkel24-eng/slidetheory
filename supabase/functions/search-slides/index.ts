// Supabase Edge Function: Search slides using RAG (pgvector)

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
    const { query, limit = 5, match_threshold = 0.7 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!query) {
      throw new Error('Query is required');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let queryEmbedding: number[] | null = null;

    // Generate embedding if OpenAI key available
    if (openaiApiKey) {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: query,
        })
      });

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json();
        queryEmbedding = embeddingData.data?.[0]?.embedding;
      }
    }

    let results;

    if (queryEmbedding) {
      // Use vector similarity search
      const { data, error } = await supabase.rpc('match_slide_library', {
        query_embedding: queryEmbedding,
        match_threshold: match_threshold,
        match_count: limit,
      });

      if (error) throw error;
      results = data;
    } else {
      // Fallback to text search
      const { data, error } = await supabase
        .from('slide_library')
        .select('*')
        .textSearch('content', query)
        .limit(limit);

      if (error) throw error;
      results = data;
    }

    return new Response(
      JSON.stringify({
        slides: results || [],
        count: results?.length || 0,
        method: queryEmbedding ? 'vector' : 'text',
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
      JSON.stringify({ error: error.message }),
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
