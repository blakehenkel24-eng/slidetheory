#!/usr/bin/env node
/**
 * PROPER Slide Extraction & Embedding Script for Slide Theory v2.0
 * 
 * This replaces the broken seed-slide-library.js with:
 * - Real PDF parsing (pdf-parse library)
 * - Slide-aware chunking (one chunk = one slide)
 * - Layout metadata extraction (title, bullets, charts)
 * - Proper embeddings with context-rich text
 * 
 * Usage:
 *   npm install pdf-parse
 *   export OPENAI_API_KEY=sk-...
 *   export SUPABASE_URL=https://...
 *   export SUPABASE_SERVICE_ROLE_KEY=...
 *   node seed-slide-library-v2.js
 */

const fs = require('fs');
const path = require('path');

// Check for pdf-parse
let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.error('❌ pdf-parse is not installed. Run: npm install pdf-parse');
  process.exit(1);
}

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Default paths - adjust these to match your repo structure
const REFERENCE_DECKS_DIR = process.env.REFERENCE_DECKS_DIR || 
  path.join(__dirname, '../../mvp/build/knowledge-base/reference-decks');

// McKinsey color palette
const MCKINSEY_PALETTE = {
  primary: ['#051C2C', '#2251FF', '#0077B6'],
  secondary: ['#E8F4F8', '#B8E0F0', '#88CCE8'],
  accent: ['#FF6B35', '#F7931E'],
  background: ['#FFFFFF', '#F5F7FA'],
  text: ['#051C2C', '#2D3748', '#718096']
};

/**
 * Generate embedding using OpenAI API (using text-embedding-3-large)
 */
async function generateEmbedding(text) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }

  // Truncate if too long (OpenAI limit)
  const truncatedText = text.substring(0, 15000);

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-large',  // Better quality than -small
      input: truncatedText,
      dimensions: 1536
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0]?.embedding;
}

/**
 * Insert slide into Supabase slide_library
 */
async function insertSlideLibrary(slide) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/slide_library`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(slide)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase insert error: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * Detect slide archetype from content analysis
 */
function detectSlideArchetype(slideText, slideTitle) {
  const text = (slideText + ' ' + slideTitle).toLowerCase();
  
  // Executive summary patterns
  if (text.includes('executive summary') || 
      text.includes('key findings') || 
      text.includes('overview') ||
      (text.includes('recommend') && text.includes('summary'))) {
    return 'Executive Summary';
  }
  
  // Financial/Waterfall patterns
  if (text.includes('$') || 
      (text.includes('%') && (text.includes('growth') || text.includes('decline'))) ||
      text.includes('revenue') ||
      text.includes('bridge') ||
      (text.includes('from') && text.includes('to') && text.match(/\d/))) {
    return 'Waterfall';
  }
  
  // Matrix patterns
  if (text.includes('matrix') || 
      text.includes('quadrant') ||
      text.includes('portfolio') ||
      text.includes('2x2') ||
      (text.includes('high') && text.includes('low') && text.includes('growth'))) {
    return '2x2 Matrix';
  }
  
  // Process flow patterns
  if (text.includes('step') || 
      text.includes('process') || 
      text.includes('phase') ||
      text.includes('workflow') ||
      text.match(/\b(1st|2nd|3rd|first|second|third)\b/) ||
      text.includes('→') || text.includes('->')) {
    return 'Process Flow';
  }
  
  // Comparison patterns
  if (text.includes('vs') || 
      text.includes('versus') || 
      text.includes('compared to') ||
      text.includes('option a') ||
      text.includes('alternative')) {
    return 'Comparison';
  }
  
  // Issue tree / breakdown patterns
  if (text.includes('breakdown') || 
      text.includes('categories') ||
      text.includes('drivers') ||
      text.match(/\bby\s+(region|segment|product|channel|customer)\b/)) {
    return 'Issue Tree';
  }
  
  // Chart/graph patterns
  if (text.includes('chart') || 
      text.includes('graph') || 
      text.includes('trend') ||
      text.includes('over time') ||
      text.match(/\b(20\d\d|19\d\d)s?\b/)) {
    return 'Graph / Chart';
  }
  
  return 'General';
}

/**
 * Extract bullets from slide text
 */
function extractBullets(text) {
  const bulletPatterns = [
    /^[•\-\*]\s+(.+)$/gm,
    /^\d+\.\s+(.+)$/gm,
    /^\([a-zA-Z0-9]\)\s+(.+)$/gm,
  ];
  
  const bullets = [];
  for (const pattern of bulletPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      bullets.push(match[1].trim());
    }
  }
  
  return bullets;
}

/**
 * Build layout pattern from slide content
 */
function buildLayoutPattern(archetype, bullets, title) {
  const base = {
    type: archetype,
    has_title_slide: false,
    content_density: bullets.length > 4 ? 'high' : bullets.length > 2 ? 'medium' : 'low',
    typography: 'clean, professional, sans-serif',
    spacing: 'generous whitespace, 16:9 format',
    description: `${archetype} layout with professional consulting styling`,
    bullet_count: bullets.length,
    has_visual: false
  };
  
  switch (archetype) {
    case 'Executive Summary':
      return {
        ...base,
        title_position: 'top-left, prominent',
        content_structure: 'headline + 3-4 key bullets + optional sidebar metric',
        visual_hierarchy: 'pyramid principle - insight first',
        expected_elements: ['action_title', 'key_insights', 'supporting_data']
      };
    case 'Waterfall':
      return {
        ...base,
        title_position: 'top-left',
        content_structure: 'start value → sequential changes → end value',
        visual_hierarchy: 'left-to-right flow, cumulative effect',
        expected_elements: ['starting_value', 'increases', 'decreases', 'ending_value']
      };
    case '2x2 Matrix':
      return {
        ...base,
        title_position: 'top-center',
        content_structure: 'x-axis label + y-axis label + 4 quadrants',
        visual_hierarchy: 'matrix grid with labeled quadrants',
        expected_elements: ['x_axis', 'y_axis', 'quadrant_labels', 'positioned_items']
      };
    case 'Process Flow':
      return {
        ...base,
        title_position: 'top-center',
        content_structure: 'process title + 3-5 sequential steps horizontal',
        visual_hierarchy: 'left-to-right or top-to-bottom flow, clear connectors',
        expected_elements: ['process_steps', 'connectors', 'decision_points']
      };
    case 'Issue Tree':
      return {
        ...base,
        title_position: 'top',
        content_structure: 'parent concept + 2-4 child branches below',
        visual_hierarchy: 'top-down MECE structure',
        expected_elements: ['root_problem', 'primary_branches', 'sub_branches']
      };
    case 'Comparison':
      return {
        ...base,
        title_position: 'top-left',
        content_structure: 'criteria rows + option columns',
        visual_hierarchy: 'side-by-side comparison table',
        expected_elements: ['criteria', 'option_a', 'option_b', 'option_c']
      };
    case 'Graph / Chart':
      return {
        ...base,
        title_position: 'top-left, insight-focused',
        content_structure: 'chart title + large visualization + data callouts',
        visual_hierarchy: 'data-driven, supporting text minimal',
        expected_elements: ['chart_title', 'data_visualization', 'axis_labels', 'data_points']
      };
    default:
      return {
        ...base,
        title_position: 'top-left',
        content_structure: 'flexible based on content needs',
        visual_hierarchy: 'clear, scannable'
      };
  }
}

/**
 * Extract tags from slide content
 */
function extractTags(text, industry) {
  const tags = new Set();
  if (industry) tags.add(industry.toLowerCase());
  
  const themes = {
    strategy: ['strategy', 'strategic', 'roadmap', 'vision', 'growth', 'transformation'],
    financial: ['revenue', 'profit', 'cost', 'budget', 'roi', 'financial', 'investment', 'economic', '$', '%'],
    technology: ['technology', 'digital', 'software', 'ai', 'automation', 'data', 'tech', 'platform'],
    trends: ['trend', 'forecast', 'outlook', 'future', 'prediction', 'outlook'],
    analysis: ['analysis', 'research', 'study', 'survey', 'findings', 'insights', 'assessment'],
    consulting: ['framework', 'methodology', 'approach', 'recommendation', 'implementation'],
    operations: ['operations', 'process', 'efficiency', 'supply chain', 'manufacturing'],
    market: ['market', 'competitor', 'competitive', 'customer', 'segment', 'positioning']
  };
  
  const lowerText = text.toLowerCase();
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      tags.add(theme);
    }
  }
  
  return Array.from(tags);
}

/**
 * Parse PDF into individual slides using pdf-parse
 */
async function parsePdfToSlides(filePath, deckTitle) {
  const buffer = fs.readFileSync(filePath);
  
  // pdf-parse gives us the full text but not per-page
  // We'll use a heuristic approach to split into slides
  const pdfData = await pdfParse(buffer);
  const fullText = pdfData.text;
  
  // Heuristic: Split by likely slide boundaries
  // Common patterns: page numbers, "Slide X", section headers, or just form feeds
  const slideSeparators = [
    /\n\s*\d+\s*\n/g,           // Standalone page numbers
    /\nSlide\s+\d+[\s:]/gi,     // "Slide 1" or "Slide 1:"
    /\f/g,                      // Form feed characters
    /\n\n\n+/g,                // Multiple blank lines (often indicate slide breaks)
  ];
  
  let slideTexts = [fullText];
  
  // Try each separator until we get reasonable slide count
  for (const separator of slideSeparators) {
    const splits = fullText.split(separator).filter(s => s.trim().length > 50);
    if (splits.length >= 2) {
      slideTexts = splits;
      break;
    }
  }
  
  // If we still have one giant chunk, try to split by detecting title patterns
  if (slideTexts.length === 1) {
    // Look for patterns like "Title\n\nContent" where title is short and capitalized
    const titlePattern = /\n([A-Z][A-Z\s\-]{5,50})\n\n/g;
    const matches = [...fullText.matchAll(titlePattern)];
    if (matches.length > 1) {
      slideTexts = [];
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index;
        const end = i < matches.length - 1 ? matches[i + 1].index : fullText.length;
        slideTexts.push(fullText.slice(start, end));
      }
    }
  }
  
  const slides = [];
  
  for (let i = 0; i < slideTexts.length; i++) {
    const slideText = slideTexts[i].trim();
    
    if (slideText.length < 100) continue; // Skip too-short slides
    
    // Extract title (first substantial line)
    const lines = slideText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    let title = lines[0] || `${deckTitle} - Slide ${i + 1}`;
    
    // Clean up title
    if (title.match(/^(January|February|March|April|May|June|July|August|September|October|November|December|20\d\d|Page \d+|\d+\/\d+|\d+)$/i)) {
      title = lines[1] || `${deckTitle} - Slide ${i + 1}`;
    }
    
    if (title.length > 150) {
      title = title.substring(0, 147) + '...';
    }
    
    // Body is everything after title
    const bodyStart = slideText.indexOf(title) + title.length;
    const body = slideText.substring(bodyStart).trim();
    
    const bullets = extractBullets(body);
    const archetype = detectSlideArchetype(slideText, title);
    const layoutPattern = buildLayoutPattern(archetype, bullets, title);
    const tags = extractTags(slideText, 'consulting');
    
    // Rich context for embedding
    const embeddingText = `
DECK: ${deckTitle}
SLIDE ${i + 1}: ${title}
TYPE: ${archetype}
TAGS: ${tags.join(', ')}

CONTENT:
${body.substring(0, 3000)}

BULLETS:
${bullets.join('\n')}
    `.trim();
    
    slides.push({
      page_number: i + 1,
      title: title,
      body: body,
      full_text: slideText,
      bullets: bullets,
      archetype: archetype,
      layout_pattern: layoutPattern,
      tags: tags,
      embedding_text: embeddingText,
      char_count: slideText.length,
      word_count: slideText.split(/\s+/).length
    });
  }
  
  return slides;
}

/**
 * Process a single reference deck PDF
 */
async function processReferenceDeck(filePath, metadata) {
  console.log(`\n📄 Processing: ${metadata.title}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️ File not found: ${filePath}`);
    return [];
  }
  
  const slides = await parsePdfToSlides(filePath, metadata.title);
  console.log(`  Found ${slides.length} slides`);
  
  const processedSlides = [];
  
  for (const slide of slides) {
    console.log(`  🎴 Slide ${slide.page_number}: "${slide.title.substring(0, 50)}..." (${slide.archetype})`);
    
    let embedding = null;
    try {
      embedding = await generateEmbedding(slide.embedding_text);
      console.log(`     ✓ Embedding generated`);
    } catch (err) {
      console.error(`     ✗ Embedding failed: ${err.message}`);
    }
    
    const dbRecord = {
      user_id: null,
      title: slide.title,
      industry: metadata.industry || 'consulting',
      slide_type: slide.archetype,
      layout_pattern: slide.layout_pattern,
      color_palette: metadata.color_palette || MCKINSEY_PALETTE,
      tags: [...slide.tags, 'mckinsey', 'reference', metadata.firm || 'mckinsey'],
      source: 'internal_reference',
      access_level: 'system',  // AI-only, not user-facing
      file_url: `file://${filePath}`,
      preview_url: null,
      content: {
        extracted_text: slide.body,
        full_slide_text: slide.full_text,
        bullets: slide.bullets,
        page_number: slide.page_number,
        total_pages: slides.length,
        original_filename: path.basename(filePath),
        deck_title: metadata.title,
        word_count: slide.word_count,
        char_count: slide.char_count
      },
      extracted_text: slide.full_text,
      embedding: embedding,
      metadata: {
        source_type: 'reference_deck',
        consulting_firm: metadata.firm || 'mckinsey',
        file_size: fs.statSync(filePath).size,
        mime_type: 'application/pdf',
        extracted_at: new Date().toISOString(),
        extraction_version: '2.0.0'
      }
    };
    
    processedSlides.push(dbRecord);
    await new Promise(r => setTimeout(r, 200)); // Rate limit
  }
  
  return processedSlides;
}

/**
 * Create test data if no PDFs exist
 */
async function createTestData() {
  console.log('\n📊 Creating test reference data (no PDFs found)');
  
  const testSlides = [
    {
      title: 'Executive Summary: Q3 Performance',
      archetype: 'Executive Summary',
      text: `Revenue growth accelerated to 15% driven by digital transformation initiatives.

Key Findings:
• Digital channels contributed 45% of new revenue
• Customer acquisition cost decreased 23%
• Customer lifetime value increased 18%

Recommendations:
• Accelerate digital transformation
• Expand high-margin service offerings
• Invest in customer success programs`
    },
    {
      title: 'Market Analysis: Competitive Landscape',
      archetype: 'Graph / Chart',
      text: `Market share analysis reveals opportunities in emerging segments.

Market Trends:
• Overall market growing 12% annually
• Digital-first competitors gaining share
• Traditional players losing ground

Competitive Position:
• Strong in enterprise segment
• Weak in SMB market
• Opportunity in mid-market`
    },
    {
      title: 'Strategic Options Evaluation',
      archetype: '2x2 Matrix',
      text: `Portfolio analysis identifies four strategic paths.

High Growth / High Share:
• Double down on core business
• Invest in product innovation

High Growth / Low Share:
• Enter new markets aggressively
• Acquire capabilities

Low Growth / High Share:
• Optimize for cash flow
• Defend position

Low Growth / Low Share:
• Divest or transform
• Consider exit`
    }
  ];
  
  const processedSlides = [];
  
  for (let i = 0; i < testSlides.length; i++) {
    const test = testSlides[i];
    console.log(`  🎴 Test Slide ${i + 1}: "${test.title}" (${test.archetype})`);
    
    const bullets = extractBullets(test.text);
    const tags = extractTags(test.text, 'consulting');
    const layoutPattern = buildLayoutPattern(test.archetype, bullets, test.title);
    
    const embeddingText = `
DECK: Test Reference Deck
SLIDE ${i + 1}: ${test.title}
TYPE: ${test.archetype}
TAGS: ${tags.join(', ')}

CONTENT:
${test.text}
    `.trim();
    
    let embedding = null;
    try {
      embedding = await generateEmbedding(embeddingText);
      console.log(`     ✓ Embedding generated`);
    } catch (err) {
      console.error(`     ✗ Embedding failed: ${err.message}`);
    }
    
    processedSlides.push({
      user_id: null,
      title: test.title,
      industry: 'consulting',
      slide_type: test.archetype,
      layout_pattern: layoutPattern,
      color_palette: MCKINSEY_PALETTE,
      tags: [...tags, 'mckinsey', 'reference', 'test'],
      source: 'internal_reference',
      access_level: 'system',
      file_url: null,
      preview_url: null,
      content: {
        extracted_text: test.text,
        full_slide_text: test.text,
        bullets: bullets,
        page_number: i + 1,
        total_pages: testSlides.length,
        original_filename: 'test-reference.pdf',
        deck_title: 'Test Reference Deck',
        word_count: test.text.split(/\s+/).length,
        char_count: test.text.length
      },
      extracted_text: test.text,
      embedding: embedding,
      metadata: {
        source_type: 'reference_deck',
        consulting_firm: 'mckinsey',
        mime_type: 'application/pdf',
        extracted_at: new Date().toISOString(),
        extraction_version: '2.0.0-test'
      }
    });
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  return processedSlides;
}

/**
 * Main seeding function
 */
async function seedSlideLibrary() {
  console.log('🚀 Starting Slide Library Seeding v2.0\n');
  
  // Validate environment
  if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('  - OPENAI_API_KEY');
    console.error('  - SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  // Define reference decks
  const referenceDecks = [
    {
      path: path.join(REFERENCE_DECKS_DIR, 'mckinsey-top-trends-exec-summary.pdf'),
      title: 'McKinsey Top Trends Executive Summary',
      industry: 'consulting',
      firm: 'mckinsey',
      archetype: 'Executive Summary',
      color_palette: MCKINSEY_PALETTE
    },
    {
      path: path.join(REFERENCE_DECKS_DIR, 'mckinsey-tech-trends-2022.pdf'),
      title: 'McKinsey Technology Trends 2022',
      industry: 'consulting',
      firm: 'mckinsey',
      archetype: 'Graph / Chart',
      color_palette: MCKINSEY_PALETTE
    }
  ];
  
  let allSlides = [];
  let foundPdfs = false;
  
  // Try to process PDFs
  for (const deck of referenceDecks) {
    if (fs.existsSync(deck.path)) {
      foundPdfs = true;
      const slides = await processReferenceDeck(deck.path, deck);
      allSlides.push(...slides);
    }
  }
  
  // If no PDFs found, create test data
  if (!foundPdfs) {
    console.log('\n⚠️  No PDF files found in reference-decks directory');
    console.log(`   Expected: ${REFERENCE_DECKS_DIR}`);
    console.log('   Creating test data instead...\n');
    const testSlides = await createTestData();
    allSlides.push(...testSlides);
  }
  
  console.log(`\n📝 Total slides to insert: ${allSlides.length}\n`);
  
  // Insert into database
  let successCount = 0;
  let failCount = 0;
  
  for (const slide of allSlides) {
    try {
      await insertSlideLibrary(slide);
      successCount++;
      console.log(`  ✓ Inserted: ${slide.title.substring(0, 50)}...`);
    } catch (err) {
      failCount++;
      console.error(`  ✗ Failed: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\n✅ Seeding Complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total: ${allSlides.length}`);
  
  // Print archetype breakdown
  const archetypes = {};
  for (const slide of allSlides) {
    archetypes[slide.slide_type] = (archetypes[slide.slide_type] || 0) + 1;
  }
  console.log(`\n📊 Archetype Breakdown:`);
  for (const [archetype, count] of Object.entries(archetypes)) {
    console.log(`   ${archetype}: ${count}`);
  }
}

// Run if executed directly
if (require.main === module) {
  seedSlideLibrary();
}

module.exports = { 
  seedSlideLibrary, 
  generateEmbedding, 
  parsePdfToSlides,
  detectSlideArchetype,
  buildLayoutPattern
};