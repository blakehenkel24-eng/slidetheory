# SlideTheory - Vercel Deployment Guide

## 🚀 Quick Start

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

## 📁 Project Structure

```
/
├── api/              # Serverless API functions
│   ├── generate.js   # Slide generation endpoint
│   ├── health.js     # Health check
│   └── waitlist.js   # Email signup
├── public/           # Static files
│   ├── index.html    # Landing page
│   └── app/          # Slide generator app
├── vercel.json       # Vercel config
└── package.json      # Dependencies
```

## 🔑 Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `KIMI_API_KEY` | Your Kimi API key |
| `KIMI_BASE_URL` | https://api.moonshot.cn/v1 |

## 🌐 URLs After Deploy

- `https://your-domain.com` → Landing page
- `https://your-domain.com/app` → Slide generator
- `https://your-domain.com/api/generate` → AI generation API

## 📦 What's Included

✅ Landing page with email signup  
✅ Slide generator app  
✅ AI-powered slide generation  
✅ Serverless API functions  
✅ Auto-deploy on git push  
✅ SSL included (free)  
✅ Global CDN  

## 🗑️ To Delete (VPS stuff)

Once Vercel is working, you can delete:
- Hostinger VPS
- All SSH keys
- Nginx configs
- PM2 processes
- Manual deployments forever
