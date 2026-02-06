// Supabase Edge Function: API proxy for slide generation
// Forwards to Kimi API

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
    const { prompt, slideType, audience } = await req.json();
    
    const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    const KIMI_BASE_URL = Deno.env.get('KIMI_BASE_URL') || 'https://api.moonshot.cn/v1';

    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-128k',
        messages: [
          {
            role: 'system',
            content: `You are an expert strategy consultant. Create ${slideType} slides for ${audience} audience. Use McKinsey/BCG style.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        content: data.choices?.[0]?.message?.content,
        jobId: crypto.randomUUID(),
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
