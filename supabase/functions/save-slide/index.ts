// Supabase Edge Function: save-slide
// Saves generated slide with full consulting-grade structure

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface SlideContent {
  headline?: string;
  subheadline?: string;
  slide_type?: string;
  layout?: string;
  content?: {
    primary_message?: string;
    bullet_points?: string[];
    supporting_elements?: Array<{
      type: string;
      label: string;
      value: string;
      context?: string;
    }>;
    visual_structure?: {
      type: string;
      description: string;
    };
  };
  chart_recommendation?: {
    type: string;
    description: string;
  };
  mece_validation?: {
    categories?: string[];
    exhaustive?: boolean;
    mutually_exclusive?: boolean;
  };
  wireframe_specs?: {
    aspect_ratio?: string;
    title_position?: string;
    content_position?: string;
    accent_elements?: string[];
  };
  metadata?: {
    generated_at?: string;
    audience?: string;
    presentation_mode?: boolean;
  };
}

interface SaveSlideRequest {
  title: string;
  content: SlideContent;
  slide_type: string;
  audience?: string;
  context?: string;
  data?: string;
  key_takeaway?: string;
  presentation_mode?: boolean;
  image_url?: string;
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

    // Create Supabase client with service role for database operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
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
    const body: SaveSlideRequest = await req.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.slide_type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: title, content, slide_type' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract structured fields from content
    const slideContent = body.content;
    
    // Prepare slide record with all consulting-grade fields
    const slideRecord = {
      user_id: user.id,
      title: body.title,
      headline: slideContent.headline || body.title,
      subheadline: slideContent.subheadline || null,
      slide_type: body.slide_type,
      layout_type: slideContent.layout || 'standard',
      primary_message: slideContent.content?.primary_message || body.key_takeaway || '',
      content: slideContent,
      wireframe_specs: slideContent.wireframe_specs || {
        aspect_ratio: '16:9',
        title_position: 'top',
        content_position: 'center',
        accent_elements: []
      },
      mece_validation: slideContent.mece_validation || {
        categories: [],
        exhaustive: true,
        mutually_exclusive: true
      },
      chart_recommendation: slideContent.chart_recommendation || {
        type: 'none',
        description: ''
      },
      audience: body.audience || slideContent.metadata?.audience || '',
      context: body.context || '',
      data: body.data || '',
      key_takeaway: body.key_takeaway || slideContent.content?.primary_message || '',
      presentation_mode: body.presentation_mode || slideContent.metadata?.presentation_mode || false,
      image_url: body.image_url || null
    };

    // Insert slide into database
    const { data: slide, error: insertError } = await supabase
      .from('slides')
      .insert(slideRecord)
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save slide' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: slide
      }),
      { 
        status: 201, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error) {
    console.error('Save slide error:', error);
    
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
