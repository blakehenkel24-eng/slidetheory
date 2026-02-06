#!/bin/bash
# COMPLETE VERCEL MIGRATION SCRIPT
# Run this to automate the entire migration

set -e

echo "🚀 SLIDETHEORY VERCEL MIGRATION"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check for required tools
command -v git >/dev/null 2>&1 || { echo "❌ git required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required"; exit 1; }

echo "✅ git, npm found"
echo ""

# Get Supabase credentials
echo -e "${YELLOW}Enter your Supabase Project URL:${NC}"
read SUPABASE_URL
echo -e "${YELLOW}Enter your Supabase Anon Key:${NC}"
read SUPABASE_ANON_KEY
echo -e "${YELLOW}Enter your Kimi API Key:${NC}"
read KIMI_API_KEY

echo ""
echo -e "${BLUE}Step 2: Update landing app config...${NC}"

# Update app-v2.js with real credentials
sed -i "s|https://your-project.supabase.co|$SUPABASE_URL|g" apps/landing/app-v2.js
sed -i "s|your-anon-key|$SUPABASE_ANON_KEY|g" apps/landing/app-v2.js
sed -i "s|https://your-project.supabase.co/functions/v1|$SUPABASE_URL/functions/v1|g" apps/landing/app-v2.js

echo "✅ Config updated"
echo ""

# Deploy Supabase functions
echo -e "${BLUE}Step 3: Deploy Supabase Edge Functions...${NC}"
echo "Run these commands in your terminal:"
echo ""
echo -e "${GREEN}cd supabase/functions${NC}"
echo -e "${GREEN}supabase login${NC}"
echo -e "${GREEN}supabase functions deploy get-templates${NC}"
echo -e "${GREEN}supabase functions deploy generate-slide${NC}"
echo -e "${GREEN}supabase functions deploy export-slide${NC}"
echo -e "${GREEN}supabase functions deploy save-slide${NC}"
echo -e "${GREEN}supabase functions deploy get-slides${NC}"
echo -e "${GREEN}supabase functions deploy search-slides${NC}"
echo ""

# Set Supabase env vars
echo -e "${BLUE}Step 4: Set Supabase Environment Variables...${NC}"
echo "Run:"
echo -e "${GREEN}supabase secrets set KIMI_API_KEY=$KIMI_API_KEY${NC}"
echo -e "${GREEN}supabase secrets set KIMI_BASE_URL=https://api.moonshot.cn/v1${NC}"
echo ""

# Create Vercel projects
echo -e "${BLUE}Step 5: Create Vercel Projects${NC}"
echo ""
echo "A. Landing Site (slidetheory.io):"
echo "   1. Go to https://vercel.com/new"
echo "   2. Import 'blakehenkel24-eng/slidetheory'"
echo "   3. Set Root Directory: apps/landing"
echo "   4. Framework: Other"
echo "   5. Click Deploy"
echo ""
echo "B. Web App (app.slidetheory.io):"
echo "   1. Go to https://vercel.com/new again"
echo "   2. Import 'blakehenkel24-eng/slidetheory'"
echo "   3. Set Root Directory: apps/web"
echo "   4. Framework: Next.js"
echo "   5. Click Deploy"
echo ""

# Environment variables
echo -e "${BLUE}Step 6: Add Environment Variables to Vercel${NC}"
echo "Add these to BOTH projects in Vercel Dashboard → Settings → Environment Variables:"
echo ""
echo -e "${YELLOW}NEXT_PUBLIC_SUPABASE_URL${NC}=$SUPABASE_URL"
echo -e "${YELLOW}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}=$SUPABASE_ANON_KEY"
echo -e "${YELLOW}SUPABASE_SERVICE_ROLE_KEY${NC}=<your_service_role_key>"
echo -e "${YELLOW}KIMI_API_KEY${NC}=$KIMI_API_KEY"
echo -e "${YELLOW}KIMI_BASE_URL${NC}=https://api.moonshot.cn/v1"
echo ""

# Domains
echo -e "${BLUE}Step 7: Configure Domains${NC}"
echo ""
echo "Landing Project:"
echo "   1. Vercel Dashboard → Your Landing Project → Settings → Domains"
echo "   2. Add 'slidetheory.io'"
echo "   3. Follow Vercel's DNS instructions"
echo ""
echo "Web App Project:"
echo "   1. Vercel Dashboard → Your Web Project → Settings → Domains"
echo "   2. Add 'app.slidetheory.io'"
echo "   3. Follow Vercel's DNS instructions"
echo ""

# DNS
echo -e "${BLUE}Step 8: Update DNS Records${NC}"
echo ""
echo "In your DNS provider (wherever you manage slidetheory.io):"
echo ""
echo "REMOVE these old records:"
echo "   ❌ A record @ → 76.13.122.30"
echo "   ❌ A record www → 76.13.122.30"
echo ""
echo "ADD these new records:"
echo "   ✅ CNAME @ → cname.vercel-dns.com"
echo "   ✅ CNAME app → cname.vercel-dns.com"
echo "   ✅ CNAME www → cname.vercel-dns.com"
echo ""

# Commit changes
echo -e "${BLUE}Step 9: Commit Config Changes${NC}"
git add apps/landing/app-v2.js
git commit -m "Update Supabase config for production"
git push origin main

echo ""
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo ""
echo "Next steps:"
echo "   1. Deploy Supabase functions (Step 3 above)"
echo "   2. Create Vercel projects (Step 5 above)"
echo "   3. Add environment variables (Step 6 above)"
echo "   4. Configure domains (Step 7 above)"
echo "   5. Update DNS (Step 8 above)"
echo "   6. Wait 5-10 minutes for DNS propagation"
echo "   7. Cancel your VPS 🎉"
echo ""
echo "Need help? Check infrastructure/VERCEL-MIGRATION.md"
