# Dependencies & Services

## External Services

| Service | Purpose | Status | Cost |
|---------|---------|--------|------|
| Hostinger VPS | Landing site hosting | ✅ Active | ~$50/yr |
| Vercel Pro | Web app hosting | ✅ Active | $20/mo |
| Supabase | Auth, DB, storage | ✅ Active | Free tier |
| Kimi API | AI generation | ✅ Active | Pay per use |
| Gemini API | Image generation | ✅ Active | Pay per use |
| GitHub | Code hosting | ✅ Active | Free |

## API Keys

All API keys stored in:
- `apps/web/.env.local` (web app)
- `apps/landing/.env` (VPS - manually managed)

**Never commit `.env` files!**

## Domain

- **Primary:** slidetheory.io
- **Registrar:** (need to document)
- **DNS:** Managed via (need to document)

## Backups

- **Supabase:** Automatic daily backups (free tier)
- **Code:** GitHub
- **VPS:** Manual backups recommended before major changes

