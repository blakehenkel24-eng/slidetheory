#!/usr/bin/env node
/**
 * Seed Script: Populate slide_library with existing slide decks
 * Parses PDF and PPTX files to extract metadata and generate embeddings
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const REFERENCE_DECKS_DIR = path.join(__dirname, '../../mvp/build/knowledge-base/reference-decks');
const EXPORTS_DIR = path.join(__dirname, '../../mvp/build/tmp/exports');

// McKinsey color palette (characteristic blue/teal scheme)
const MCKINSEY_PALETTE = {
  primary: ['#051C2C', '#2251FF', '#0077B6'],
  secondary: ['#E8F4F8', '#B8E0F0', '#88CCE8'],
  accent: ['#FF6B35', '#F7931E'],
  background: ['#FFFFFF', '#F5F7FA'],
  text: ['#051C2C', '#2D3748', '#718096']
};

// Standard consulting palette
const CONSULTING_PALETTE = {
  primary: ['#1E3A5F', '#2E5C8A', '#4A90A4'],
  secondary: ['#E8F1F8', '#D1E3F0', '#B8D4E8'],
  accent: ['#D97706', '#059669'],
  background: ['#FFFFFF', '#F8FAFC'],
  text: ['#0F172A', '#334155', '#64748B']
};

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000),
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
    throw new Error(`Supabase insert error: ${error}`);
  }

  return await response.json();
}

/**
 * Extract text content from PDF (basic extraction)
 */
function extractPdfContent(filePath) {
  const buffer = fs.readFileSync(filePath);
  let text = '';
  
  // Simple text extraction from PDF buffer
  // Look for text objects in PDF
  const textRegex = /\(([^)]+)\)/g;
  const matches = buffer.toString('latin1').match(textRegex) || [];
  
  text = matches
    .map(m => m.slice(1, -1)) // Remove parentheses
    .filter(m => m.length > 3 && /[a-zA-Z]{3,}/.test(m)) // Filter meaningful text
    .join(' ')
    .substring(0, 5000);
  
  return text;
}

/**
 * Extract basic metadata from PPTX (zip-based format)
 */
function extractPptxMetadata(filePath) {
  // PPTX files are ZIP archives containing XML
  // For this seeding, we'll extract based on file characteristics
  const stats = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  
  // Look for slide content indicators in the XML
  const content = buffer.toString('utf8');
  
  // Extract text from XML text elements
  const textMatches = content.match(/<a:t>([^<]+)<\/a:t>/g) || [];
  const extractedText = textMatches
    .map(m => m.replace(/<\/?a:t>/g, ''))
    .join(' ')
    .substring(0, 3000);
  
  // Count approximate slides by looking for slide files
  const slideCount = (content.match(/slide[0-9]+\.xml/g) || []).length;
  
  // Detect chart types
  const hasChart = content.includes('chart') || content.includes('Chart');
  const hasTable = content.includes('table') || content.includes('Table');
  const hasImage = content.includes('image') || content.includes('Image');
  
  return {
    file_size: stats.size,
    slide_count: Math.max(slideCount, 1),
    extracted_text: extractedText,
    has_chart: hasChart,
    has_table: hasTable,
    has_image: hasImage
  };
}

/**
 * Detect slide archetype from content
 */
function detectSlideArchetype(text, filename) {
  const lowerText = text.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('exec') || lowerFilename.includes('summary') || 
      lowerText.includes('executive summary') || lowerText.includes('key findings')) {
    return 'Executive Summary';
  }
  
  if (lowerText.includes('trend') || lowerText.includes('2022') || 
      lowerText.includes('2023') || lowerText.includes('2024') ||
      lowerFilename.includes('trend')) {
    return 'Graph / Chart';
  }
  
  if (lowerText.includes('process') || lowerText.includes('step') || 
      lowerText.includes('flow') || lowerText.includes('timeline')) {
    return 'Horizontal Flow';
  }
  
  if (lowerText.includes('breakdown') || lowerText.includes('hierarchy') || 
      lowerText.includes('structure') || lowerText.includes('framework')) {
    return 'Vertical Flow';
  }
  
  if (lowerFilename.includes('market') || lowerFilename.includes('analysis') ||
      lowerText.includes('market analysis') || lowerText.includes('competitive')) {
    return 'Graph / Chart';
  }
  
  return 'General';
}

/**
 * Extract tags from content
 */
function extractTags(text, industry) {
  const tags = new Set();
  if (industry) tags.add(industry.toLowerCase());
  
  const themes = {
    'strategy': ['strategy', 'strategic', 'plan', 'roadmap', 'vision', 'growth'],
    'financial': ['revenue', 'profit', 'cost', 'budget', 'roi', 'financial', 'investment', 'economic'],
    'technology': ['technology', 'digital', 'software', 'ai', 'automation', 'data', 'tech'],
    'trends': ['trend', 'forecast', 'outlook', 'future', 'prediction'],
    'analysis': ['analysis', 'research', 'study', 'survey', 'findings', 'insights'],
    'consulting': ['framework', 'methodology', 'approach', 'recommendation']
  };
  
  const lowerText = text.toLowerCase();
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      tags.add(theme);
    }
  }
  
  return Array.from(tags);
}

/**
 * Build layout pattern from metadata
 */
function buildLayoutPattern(metadata, archetype) {
  const base = {
    type: archetype,
    has_title_slide: true,
    content_density: metadata.file_size > 50000 ? 'high' : 'medium',
    typography: 'clean, professional, sans-serif',
    spacing: 'generous whitespace, 16:9 format',
    description: `${archetype} layout with professional consulting styling`
  };
  
  switch (archetype) {
    case 'Executive Summary':
      return {
        ...base,
        title_position: 'top-left, prominent',
        content_structure: 'headline + 3-4 key bullets + optional sidebar metric',
        visual_hierarchy: 'pyramid principle - insight first'
      };
    case 'Graph / Chart':
      return {
        ...base,
        title_position: 'top-left, insight-focused',
        content_structure: 'chart title + large visualization + data callouts',
        visual_hierarchy: 'data-driven, supporting text minimal'
      };
    case 'Horizontal Flow':
      return {
        ...base,
        title_position: 'top-center',
        content_structure: 'process title + 3-5 sequential steps horizontal',
        visual_hierarchy: 'left-to-right flow, clear connectors'
      };
    case 'Vertical Flow':
      return {
        ...base,
        title_position: 'top',
        content_structure: 'parent concept + 2-4 child branches below',
        visual_hierarchy: 'top-down MECE structure'
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
 * Process reference decks (McKinsey PDFs)
 */
async function processReferenceDecks() {
  const files = [
    {
      path: path.join(REFERENCE_DECKS_DIR, 'mckinsey-top-trends-exec-summary.pdf'),
      title: 'McKinsey Top Trends Executive Summary',
      industry: 'consulting',
      archetype: 'Executive Summary'
    },
    {
      path: path.join(REFERENCE_DECKS_DIR, 'mckinsey-tech-trends-2022.pdf'),
      title: 'McKinsey Technology Trends 2022',
      industry: 'consulting',
      archetype: 'Graph / Chart'
    }
  ];
  
  const slides = [];
  
  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      console.log(`⚠️ File not found: ${file.path}`);
      continue;
    }
    
    console.log(`📄 Processing: ${file.title}`);
    
    const content = extractPdfContent(file.path);
    const archetype = file.archetype || detectSlideArchetype(content, file.title);
    const tags = extractTags(content, file.industry);
    const layoutPattern = buildLayoutPattern({ file_size: fs.statSync(file.path).size }, archetype);
    
    // Split content into pseudo-slides (every ~800 chars)
    const chunks = content.match(/.{1,800}/g) || [content];
    
    for (let i = 0; i < Math.min(chunks.length, 5); i++) {
      const chunk = chunks[i];
      const slideTitle = i === 0 ? file.title : `${file.title} - Slide ${i + 1}`;
      
      // Generate embedding
      const embeddingText = `${slideTitle} ${chunk} ${tags.join(' ')} ${file.industry} ${archetype}`;
      let embedding = null;
      
      try {
        embedding = await generateEmbedding(embeddingText);
        console.log(`  ✓ Generated embedding for chunk ${i + 1}/${chunks.length}`);
      } catch (err) {
        console.error(`  ✗ Embedding failed: ${err.message}`);
      }
      
      slides.push({
        user_id: null, // Public template
        title: slideTitle,
        industry: file.industry,
        slide_type: archetype,
        layout_pattern: layoutPattern,
        color_palette: MCKINSEY_PALETTE,
        tags: [...tags, 'mckinsey', 'reference', 'professional'],
        source: 'template', // Using 'template' as source for reference decks
        file_url: `file://${file.path}`,
        preview_url: null,
        content: {
          extracted_text: chunk,
          page_number: i + 1,
          total_pages: chunks.length,
          original_filename: path.basename(file.path)
        },
        extracted_text: chunk,
        embedding,
        metadata: {
          source_type: 'reference_deck',
          consulting_firm: 'mckinsey',
          file_size: fs.statSync(file.path).size,
          mime_type: 'application/pdf'
        }
      });
    }
  }
  
  return slides;
}

/**
 * Process exported PPTX files
 */
async function processExportedDecks() {
  const files = fs.readdirSync(EXPORTS_DIR)
    .filter(f => f.endsWith('.pptx'))
    .map(f => path.join(EXPORTS_DIR, f));
  
  const slides = [];
  
  for (const filePath of files) {
    const filename = path.basename(filePath);
    console.log(`📊 Processing: ${filename}`);
    
    const metadata = extractPptxMetadata(filePath);
    const archetype = detectSlideArchetype(metadata.extracted_text, filename);
    const tags = extractTags(metadata.extracted_text, 'general');
    const layoutPattern = buildLayoutPattern(metadata, archetype);
    
    // Generate embedding
    const embeddingText = `${filename} ${metadata.extracted_text} ${tags.join(' ')} ${archetype}`;
    let embedding = null;
    
    try {
      embedding = await generateEmbedding(embeddingText);
      console.log(`  ✓ Generated embedding`);
    } catch (err) {
      console.error(`  ✗ Embedding failed: ${err.message}`);
    }
    
    slides.push({
      user_id: null, // Public template
      title: `Generated Export - ${filename.replace('.pptx', '')}`,
      industry: 'general',
      slide_type: archetype,
      layout_pattern: layoutPattern,
      color_palette: CONSULTING_PALETTE,
      tags: [...tags, 'generated', 'export'],
      source: 'generated',
      file_url: `file://${filePath}`,
      preview_url: null,
      content: {
        extracted_text: metadata.extracted_text,
        has_chart: metadata.has_chart,
        has_table: metadata.has_table,
        has_image: metadata.has_image,
        slide_count: metadata.slide_count,
        original_filename: filename
      },
      extracted_text: metadata.extracted_text,
      embedding,
      metadata: {
        source_type: 'generated_export',
        file_size: metadata.file_size,
        mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        generated_at: fs.statSync(filePath).mtime.toISOString()
      }
    });
  }
  
  return slides;
}

/**
 * Main seeding function
 */
async function seedSlideLibrary() {
  console.log('🚀 Starting Slide Library Seeding\n');
  
  // Validate environment
  if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('  - OPENAI_API_KEY');
    console.error('  - SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  try {
    // Process reference decks
    console.log('📚 Processing Reference Decks...\n');
    const referenceSlides = await processReferenceDecks();
    console.log(`  Found ${referenceSlides.length} reference slides\n`);
    
    // Process exported decks
    console.log('📦 Processing Generated Exports...\n');
    const exportSlides = await processExportedDecks();
    console.log(`  Found ${exportSlides.length} export slides\n`);
    
    // Combine all slides
    const allSlides = [...referenceSlides, ...exportSlides];
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
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 100));
    }
    
    console.log(`\n✅ Seeding Complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Total: ${allSlides.length}`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  seedSlideLibrary();
}

module.exports = { seedSlideLibrary, generateEmbedding };
