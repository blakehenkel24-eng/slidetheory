# RAG Slide Repository

Semantic search-powered slide library for SlideTheory. Enables AI-generated slides to reference internal style guides for inspiration.

## Architecture

```
User Query → Embedding Generation → Internal Slide Search → Style Examples → Kimi Prompt → Generated Slide
                                      (AI-only, not user-facing)
```

## Components

### Database Schema

**slide_library** - Stores slides with vector embeddings:
- `embedding VECTOR(1536)` - OpenAI text-embedding-3-small
- `layout_pattern JSONB` - Structural metadata
- `color_palette JSONB` - Color scheme information
- `source` - uploaded | generated | template | reference | **internal_reference**
- `access_level` - public | user | **system** (AI-only)

**Access Levels:**
- `public` - Visible to all authenticated users
- `user` - Owner only
- `system` - **AI internal use only**, never exposed to users

**slide_uploads** - Tracks user-uploaded files (separate from internal references)

### Edge Functions

**search-slides** (`/functions/v1/search-slides`)
- User-facing search
- Excludes `internal_reference` slides automatically
- Returns user-owned and public templates only

**search_internal_slides** (RPC function)
- System-only search for AI generation
- Queries only `internal_reference` slides
- Used by generate-slide function

**generate-slide** (enhanced)
- Calls `search_internal_slides()` for RAG retrieval
- Injects internal style examples into Kimi prompt
- Users never see the reference slides

### API Routes

- `POST /api/slides/search` - User search (excludes internal)
- `POST /api/slides/upload` - User uploads (separate from internal refs)
- `POST /api/slides/generate` - Generate with internal RAG

## Internal Reference Data

These slides are **NOT user-facing**. They exist only for AI style inspiration.

### McKinsey Reference Decks (INTERNAL)
Located in `/mvp/build/knowledge-base/reference-decks/`:

| File | Archetypes | Source | Access |
|------|-----------|--------|--------|
| mckinsey-top-trends-exec-summary.pdf | Executive Summary, Bar Charts | internal_reference | system |
| mckinsey-tech-trends-2022.pdf | Frameworks, Waterfall, Process Flow | internal_reference | system |

### Generated Exports (INTERNAL)
Located in `/mvp/build/tmp/exports/`:
- 5 generated slide decks
- Used for pattern recognition
- Source: internal_reference, Access: system

## Seeding Internal References

### SQL Seed (Recommended)

```bash
# First run the access migration
psql $DATABASE_URL -f supabase/migrations/006_add_internal_reference_access.sql

# Then seed internal references
psql $DATABASE_URL -f supabase/seed-internal-references.sql
```

### Dynamic Seeding (with real embeddings)

```bash
cd supabase
export OPENAI_API_KEY=sk-...
export SUPABASE_URL=https://...
export SUPABASE_SERVICE_ROLE_KEY=...

node seed-slide-library.js
# Note: Update the script to set source='internal_reference' and access_level='system'
```

## Color Palettes

### McKinsey Palette (INTERNAL REFERENCE)
```json
{
  "primary": ["#051C2C", "#2251FF", "#0077B6"],
  "secondary": ["#E8F4F8", "#B8E0F0", "#88CCE8"],
  "accent": ["#FF6B35", "#00C853"],
  "background": ["#FFFFFF", "#F5F7FA"],
  "text": ["#051C2C", "#2D3748", "#718096"]
}
```

### Standard Consulting Palette
```json
{
  "primary": ["#1E3A5F", "#2E5C8A", "#4A90A4"],
  "secondary": ["#E8F1F8", "#D1E3F0", "#B8D4E8"],
  "accent": ["#D97706", "#059669"],
  "background": ["#FFFFFF", "#F8FAFC"],
  "text": ["#0F172A", "#334155", "#64748B"]
}
```

## Usage

### Generate Slide with Internal RAG
```javascript
const response = await fetch('/api/slides/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    slide_type: "Executive Summary",
    audience: "C-Suite",
    context: "Q3 financial performance",
    industry: "consulting",
    use_rag: true  // Uses internal_reference slides automatically
  })
});
// Response includes generated slide, but NOT the internal references used
```

### Search User-Facing Slides
```javascript
const response = await fetch('/api/slides/search', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    query: "market analysis template"
    // Excludes internal_reference slides automatically
  })
});
```

## SQL Functions

### User Search (excludes internal)
```sql
SELECT * FROM search_similar_slides(
  query_embedding := $1,
  match_threshold := 0.7,
  match_count := 5,
  filter_user_id := $2,
  filter_industry := NULL,
  filter_slide_type := NULL,
  include_internal := FALSE  -- Default, excludes internal_reference
);
```

### System/AI Search (internal only)
```sql
SELECT * FROM search_internal_slides(
  query_embedding := $1,
  match_threshold := 0.5,
  match_count := 3,
  filter_industry := 'consulting',
  filter_slide_type := 'Executive Summary'
);
-- Only returns internal_reference slides
```

## Security

### RLS Policies

```sql
-- Users CANNOT see system access_level slides
CREATE POLICY "Users can view accessible library slides"
    ON public.slide_library FOR SELECT
    USING (
        auth.uid() = user_id 
        OR access_level = 'public'
        -- system access_level is excluded!
    );
```

### Data Flow

```
User Request
    ↓
Generate Endpoint
    ↓
search_internal_slides()  -- Service role only
    ↓
Internal Reference Slides (never exposed)
    ↓
Style examples injected into Kimi prompt
    ↓
Generated Slide (returned to user)
```

## Testing

```sql
-- Verify internal slides exist
SELECT 
  source,
  access_level,
  industry,
  slide_type,
  COUNT(*)
FROM slide_library
WHERE source = 'internal_reference'
GROUP BY source, access_level, industry, slide_type;

-- Verify users cannot see internal slides
SET ROLE authenticated;
SELECT COUNT(*) FROM slide_library WHERE source = 'internal_reference';
-- Should return 0

-- Verify internal search works (as service role)
SELECT COUNT(*) FROM search_internal_slides(
  query_embedding := (SELECT embedding FROM slide_library LIMIT 1),
  match_threshold := 0.0
);
-- Should return internal slides
```

## File Locations

```
/products/slidetheory/
├── supabase/
│   ├── migrations/
│   │   ├── 005_create_slide_library.sql       # Base schema
│   │   └── 006_add_internal_reference_access.sql  # Access controls
│   ├── functions/
│   │   ├── generate-slide/index.ts            # Uses internal RAG
│   │   └── search-slides/index.ts             # User search (no internal)
│   ├── seed-internal-references.sql           # Seed script
│   └── RAG_README.md                          # This file
├── api/slides/
│   ├── search.js                              # User search endpoint
│   └── upload.js                              # User upload endpoint
└── mvp/build/knowledge-base/reference-decks/  # Source PDFs (internal)
    ├── mckinsey-top-trends-exec-summary.pdf
    └── mckinsey-tech-trends-2022.pdf
```

## Important Notes

- **Internal references are NEVER exposed to users**
- **Users cannot search or retrieve internal slides**
- **Only the AI (via service role) can access internal_reference slides**
- **Internal slides are used purely for style inspiration**
- **No PII or sensitive data should be in internal references**
