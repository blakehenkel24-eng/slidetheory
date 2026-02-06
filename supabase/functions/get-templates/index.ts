// Supabase Edge Function: /api/v2/templates
// Returns available slide templates

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  }

  const templates = [
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      category: 'strategy',
      description: 'High-level overview for C-suite',
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      category: 'research',
      description: 'Market sizing and competitive landscape',
    },
    {
      id: 'financial-model',
      name: 'Financial Model',
      category: 'finance',
      description: 'Revenue projections and valuation',
    },
    {
      id: 'recommendation',
      name: 'Recommendation',
      category: 'strategy',
      description: 'Clear recommendation with rationale',
    },
    {
      id: 'problem-statement',
      name: 'Problem Statement',
      category: 'strategy',
      description: 'Define the core problem clearly',
    },
    {
      id: 'solution-overview',
      name: 'Solution Overview',
      category: 'strategy',
      description: 'Present solution approach',
    },
  ];

  return new Response(
    JSON.stringify({ templates }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
});
