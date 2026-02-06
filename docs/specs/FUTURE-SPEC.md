# SlideTheory Future State Spec — v2.0

## Vision
AI-native slide generation. No templates, no HTML — pure AI creates consulting slides from scratch, trained on MBB knowledge base.

---

## User Flow
1. User describes context (topic, audience, key message, rough data)
2. AI queries MBB knowledge base for best slide structure
3. AI generates complete slide as image (Kimi or Nano Banana)
4. User downloads PNG or editable PowerPoint
5. Optional: Iterate/regenerate with feedback

---

## Key Difference from MVP
| Aspect | MVP (v1.1) | Future (v2.0) |
|--------|------------|---------------|
| **Rendering** | HTML → screenshot | Pure AI image generation |
| **Speed** | 1-3 seconds | 5-10 seconds |
| **Text accuracy** | Perfect | Good (AI-dependent) |
| **Visual variety** | Limited by templates | Unlimited |
| **Cost per slide** | ~$0.001 | ~$0.03-0.06 |
| **Feel** | Structured, predictable | Creative, dynamic |

---

## MBB Knowledge Base
**Purpose:** Train AI on McKinsey/BCG/Bain slide patterns

**Data Sources:**
- MBB slide deck PDFs (public case studies, reports)
- Structure patterns: executive summaries, 2x2 matrices, waterfalls
- Layout principles: title placement, text hierarchy, visual balance
- Frameworks: MECE, issue trees, pyramid principle, BCG matrix
- Typography & color conventions

**Implementation:**
- Parse PDFs → extract slide images
- Generate embeddings (vector representation)
- Store in vector DB (Pinecone/Weaviate)
- RAG: Retrieve similar slides → inform AI generation prompt

---

## Technical Architecture

### Image Generation
**Option A: Kimi K2.5**
- Pros: Available now, fast, decent text rendering
- Cons: Not purpose-built for slides

**Option B: Nano Banana**
- Pros: Purpose-built for slides (if exists)
- Cons: Need to verify availability

**Option C: Hybrid**
- AI generates layout concept
- HTML/CSS renders final slide (best of both)

### Backend
- Vector DB for slide embeddings
- Retrieval-augmented generation (RAG)
- Fine-tuned prompts for consulting slide structure
- Feedback loop (user ratings improve model)

---

## Features

### v2.0 Core
- Natural language input (no forms)
- MBB knowledge base integration
- AI image generation
- PNG + editable PPTX export
- Regenerate with feedback

### v2.1
- Multi-slide deck generation
- Custom branding (upload logo, set colors)
- Team workspace
- Version history

### v2.2
- API for enterprise
- Plugin ecosystem
- Real-time collaboration

---

## Open Questions
1. **Nano Banana:** Does this model exist? Verify availability.
2. **MBB Data:** Source for training decks? Public reports? Scraped case studies?
3. **Text Accuracy:** How to ensure readable text in AI-generated slides? Hybrid approach?
4. **Cost:** At $0.03-0.06/slide, can pricing sustain this?

---

## Success Metrics
- **v2.0 Launch:** TBD (after MVP validation)
- **User retention:** 50%+ monthly active
- **NPS:** 50+
- **MRR:** $1,000 by EOY 2026

---

## Path from MVP to v2.0
1. **Validate MVP** — Get users, confirm demand
2. **Build knowledge base** — Source MBB slides, create embeddings
3. **Prototype AI gen** — Test Kimi image generation
4. **Hybrid approach** — AI layouts + HTML rendering if text accuracy fails
5. **Iterate** — User feedback drives improvements

---

**Status:** Vision document, no code yet  
**Dependencies:** MVP validation, MBB data sourcing, AI image gen testing
