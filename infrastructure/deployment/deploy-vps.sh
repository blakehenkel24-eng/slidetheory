#!/bin/bash
# VPS Deployment Script for SlideTheory
# Pulls from GitHub and deploys to production

set -e

REPO_URL="https://github.com/blakehenkel24-eng/slidetheory.git"
DEPLOY_DIR="/var/www/slidetheory"
BACKEND_DIR="/opt/slidetheory-backend"
LOG_FILE="/var/log/slidetheory-deploy.log"

echo "=== SlideTheory VPS Deployment ===" | tee -a $LOG_FILE
date | tee -a $LOG_FILE

# Pull latest code
echo "Pulling from GitHub..." | tee -a $LOG_FILE
cd $DEPLOY_DIR
git fetch origin main
git reset --hard origin/main

# Deploy landing site (static files)
echo "Deploying landing site..." | tee -a $LOG_FILE
rsync -avz --delete apps/landing/ $DEPLOY_DIR/

# Deploy backend (Node.js app)
echo "Deploying backend..." | tee -a $LOG_FILE
mkdir -p $BACKEND_DIR
cd $BACKEND_DIR

# If first deploy, clone and setup
if [ ! -d ".git" ]; then
  git clone $REPO_URL .
fi

git fetch origin main
git reset --hard origin/main

# Install dependencies and restart
cd apps/landing  # Backend is in landing for now
npm install --production

# Restart PM2
pm2 restart slidetheory-backend || pm2 start app.js --name slidetheory-backend
pm2 save

echo "Deployment complete!" | tee -a $LOG_FILE
date | tee -a $LOG_FILE
