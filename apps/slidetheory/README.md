# SlideTheory Frontend

Next.js 14 frontend for AI-powered consulting slide generation.

## Features

- 🎨 Dark theme with slate color palette
- 📊 5 consulting slide archetypes (Executive Summary, Horizontal/Vertical Flow, Graph/Chart, General)
- 👥 4 audience types (C-Suite, PE/Investors, External Client, Internal Team)
- 🖼️ 16:9 slide preview with zoom controls
- 💾 Export to PNG, PDF (PPTX coming soon)
- 🔐 Supabase auth integration
- 📱 Responsive design

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and API credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
app/
  layout.tsx        # Root layout
  page.tsx          # Main page (split panel layout)
  providers.tsx     # Supabase context
  globals.css       # Global styles

components/
  header.tsx        # Navigation header
  slide-form.tsx    # Left panel - input form
  slide-preview.tsx # Right panel - preview
  auth-modal.tsx    # Login/signup modal
  ui/               # shadcn components

lib/
  api.ts            # API client
  types.ts          # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- html2canvas (PNG export)
- jspdf (PDF export)
