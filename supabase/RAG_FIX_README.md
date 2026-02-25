# Slide Theory RAG Fix - Complete Implementation

## What Was Broken

The original RAG implementation had these critical issues:

### 1. Broken PDF Extraction (`seed-slide-library.js`)
- **Line 186**: `const chunks = content.match(/.{1,800}/g)` — Just split every 800 characters!
- **Lines 131-145**: Used regex on binary buffer instead of parsing PDF structure
- No slide boundary detection — chunks cut through tables and split titles from content
- Used `text-embedding-3-small` (lower quality)

### 2. No RAG Integration (`generate-slide/index.ts`)
- The edge function NEVER actually called the RAG retrieval!
- It just called OpenAI directly with a system prompt
- No reference examples were ever injected

### 3. Missing Schema (`005_create_slide_library.sql`)
- No `access_level` column for system/user/public separation
- `source` enum didn't include 'internal_reference'
- No `search_internal_slides` RPC function

## What Was Fixed

### 1. New Migration: `007_fix_rag_schema.sql`

```sql
-- Adds access_level column (public/user/system)
-- Updates source enum to include 'internal_reference'
-- Creates search_internal_slides() function for AI-only retrieval
-- Updates RLS policies to hide system slides from users
```

### 2. New Seed Script: `seed-slide-library-v2.js`

**Key improvements:**
- Uses `pdf-parse` library for actual PDF parsing
- Heuristic-based slide boundary detection
- Archetype detection (Executive Summary, Waterfall, 2x2 Matrix, etc.)
- Rich embedding text with context (deck + title + type + content)
- Uses `text-embedding-3-large` for better quality
- Sets `access_level = 'system'` for AI-only internal references

**Slide Archetypes Detected:**
- Executive Summary
- Waterfall (financial bridges)
- 2x2 Matrix
- Process Flow
- Issue Tree
- Comparison
- Graph / Chart
- General

### 3. Fixed Edge Function: `generate-slide/index.ts`

**Key changes:**
- Calls `search_internal_slides()` RPC to retrieve reference examples
- Generates embedding for user query using `text-embedding-3-large`
- Injects reference examples into OpenAI prompt as style guide
- Returns `rag` metadata in response showing which examples were used
- Falls back gracefully if RAG fails

### 4. Updated Edge Function: `search-slides/index.ts`

**Key changes:**
- Uses `text-embedding-3-large` instead of `-small`
- Better error handling with fallback to text search
- Returns debug info if embedding fails
- Supports filtering by industry and slide_type

## How to Deploy

### Step 1: Run the Migration

```bash
cd supabase
psql $DATABASE_URL -f migrations/007_fix_rag_schema.sql
```

Or via Supabase Dashboard SQL Editor.

### Step 2: Install pdf-parse

```bash
cd supabase
npm install pdf-parse
```

### Step 3: Seed the Database

```bash
cd supabase
export OPENAI_API_KEY=sk-...
export SUPABASE_URL=https://...
export SUPABASE_SERVICE_ROLE_KEY=...

# With PDFs (if you have them in mvp/build/knowledge-base/reference-decks/)
node seed-slide-library-v2.js

# Without PDFs (creates test data)
# The script auto-detects missing PDFs and creates test slides
```

### Step 4: Deploy Edge Functions

```bash
# Copy the fixed functions
supabase functions deploy generate-slide
supabase functions deploy search-slides
```

Or manually update via Supabase Dashboard.

### Step 5: Test

```javascript
// Test RAG generation
const response = await fetch('/api/slides/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    context: "Our Q3 revenue grew 15% driven by digital transformation",
    keyTakeaway: "Digital channels are now our primary growth driver",
    slideType: "Executive Summary",
    useRag: true  // Enable RAG
  })
});

// Response includes:
// {
//   blueprint: {...},
//   slide: {...},
//   rag: {
//     used: true,
//     examplesFound: 3,
//     exampleTitles: ["Executive Summary: Q3 Performance", ...]
//   }
// }
```

## File Structure

```
supabase/
├── migrations/
│   ├── 005_create_slide_library.sql      # Original (unchanged)
│   └── 007_fix_rag_schema.sql            # NEW - RAG fixes
├── functions/
│   ├── generate-slide/
│   │   └── index.ts                      # FIXED - Now uses RAG
│   └── search-slides/
│       └── index.ts                      # FIXED - Uses -large embeddings
├── seed-slide-library-v2.js              # NEW - Proper PDF extraction
└── package.json                          # Add pdf-parse dependency
```

## Key Design Decisions

### 1. Slide-Aware Chunking
Each PDF page = one slide embedding. No arbitrary splits.

### 2. Internal References are System-Only
- `source = 'internal_reference'`
- `access_level = 'system'`
- Users can NEVER see these via normal queries
- Only the `search_internal_slides()` RPC can access them
- Service role required

### 3. Archetype Detection
Automatically categorizes slides by type so RAG can match:
- "Executive Summary" queries get Executive Summary examples
- "Waterfall" queries get Waterfall examples

### 4. Rich Embedding Context
Each embedding includes:
```
DECK: McKinsey Top Trends 2022
SLIDE 3: Market Analysis Summary
TYPE: Graph / Chart
TAGS: strategy, market, analysis

CONTENT:
[full slide text]

BULLETS:
• Point 1
• Point 2
```

This gives the vector search MUCH better semantic matching.

## Next Steps

1. **Add More Reference Decks**: Put PDFs in `mvp/build/knowledge-base/reference-decks/` and re-run seed
2. **Fine-Tune Thresholds**: Adjust `match_threshold` in `search_internal_slides()` if results aren't relevant
3. **Add PPTX Support**: Extend seed script to handle PowerPoint files (use `pptx-parser` library)
4. **Visual Analysis**: Add image analysis to detect charts/graphs (use GPT-4 Vision)

## Troubleshooting

### "pdf-parse not found"
```bash
cd supabase
npm install pdf-parse
```

### "No slides found in PDF"
The PDF might be scanned images. Try OCR first or add manual text extraction.

### "RAG not working" (examplesFound: 0)
1. Check that internal slides exist: 
   ```sql
   SELECT COUNT(*) FROM slide_library WHERE source = 'internal_reference';
   ```
2. Check embeddings exist:
   ```sql
   SELECT COUNT(*) FROM slide_library WHERE embedding IS NOT NULL;
   ```
3. Lower the match_threshold in the function call (try 0.3 instead of 0.5)

### "Access denied to internal slides"
Make sure you're using the service role key, not the anon key.

---

Built for Slide Theory. Makes AI-generated slides actually reference your McKinsey/BCG examples.