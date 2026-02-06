# SlideTheory Production Deployment Guide

## Deployment Package

**File:** `slidetheory-deploy-v2.0.tar.gz`
**Location:** `/home/node/.openclaw/workspace/`
**Version:** 2.0.0
**Date:** 2026-02-05

---

## Target Server

- **VPS IP:** 76.13.122.30
- **Domain:** slidetheory.io
- **User:** root (or configured SSH user)
- **Web Root:** /var/www/slidetheory/

---

## Deployment Methods

### Method 1: FileZilla (Recommended for GUI users)

1. **Download the deployment package:**
   - File: `slidetheory-deploy-v2.0.tar.gz`

2. **Connect to VPS via FileZilla:**
   - Host: `sftp://76.13.122.30`
   - Username: `root` (or your SSH username)
   - Password: (your SSH password)
   - Port: `22`

3. **Upload files to web directory:**
   - Navigate to `/var/www/slidetheory/` on the remote server
   - If directory doesn't exist, create it: `mkdir -p /var/www/slidetheory`
   - Upload all contents from the deployment package

4. **Extract on server:**
   ```bash
   cd /var/www/slidetheory
   tar -xzf slidetheory-deploy-v2.0.tar.gz
   ```

### Method 2: SCP Command Line

```bash
# Copy archive to server
scp slidetheory-deploy-v2.0.tar.gz root@76.13.122.30:/tmp/

# SSH into server and extract
ssh root@76.13.122.30
cd /var/www/slidetheory
tar -xzf /tmp/slidetheory-deploy-v2.0.tar.gz
```

### Method 3: Manual File-by-File Upload

If archive extraction isn't available, upload these folders/files:

**Required Structure:**
```
/var/www/slidetheory/
├── public/              # Static HTML/CSS/JS files
│   ├── index.html       # Homepage
│   ├── how-it-works.html
│   ├── resources.html
│   ├── blog.html
│   ├── gallery.html
│   ├── privacy.html
│   ├── terms.html
│   ├── styles.css
│   ├── app.js
│   ├── gallery.js
│   └── ...
├── server.js            # Node.js backend
├── package.json         # Dependencies
├── config/              # Configuration files
├── controllers/         # API controllers
├── lib/                 # Core libraries
├── middleware/          # Express middleware
├── models/              # Data models
├── routes/              # API routes
├── services/            # Business logic
├── utils/               # Helper utilities
├── knowledge-base/      # Consulting content
└── .env                 # Environment variables (create manually)
```

---

## Server Configuration

### 1. Install Node.js (if not installed)

```bash
# Using NodeSource (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18+
npm --version
```

### 2. Install Dependencies

```bash
cd /var/www/slidetheory
npm install --production
```

### 3. Create Environment File

```bash
cd /var/www/slidetheory
cp .env.example .env
nano .env  # Edit with your API keys
```

**Required .env variables:**
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# AI Provider API Keys (add at least one)
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here
# OR
GEMINI_API_KEY=your_gemini_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Export Configuration
EXPORTS_MAX_CONCURRENT=3
EXPORTS_CLEANUP_INTERVAL_MINUTES=60
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/slidetheory`:

```nginx
server {
    listen 80;
    server_name slidetheory.io www.slidetheory.io;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name slidetheory.io www.slidetheory.io;
    
    # SSL Configuration
    ssl_certificate /path/to/your/ssl/certificate.crt;
    ssl_certificate_key /path/to/your/ssl/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Static files
    location / {
        root /var/www/slidetheory/public;
        try_files $uri $uri.html $uri/ =404;
        index index.html;
    }
    
    # API proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/slidetheory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d slidetheory.io -d www.slidetheory.io

# Auto-renewal test
sudo certbot renew --dry-run
```

### 6. Start Node.js Application

Using PM2 (recommended):
```bash
# Install PM2
sudo npm install -g pm2

# Start application
cd /var/www/slidetheory
pm2 start server.js --name slidetheory

# Save PM2 config
pm2 save
pm2 startup systemd
```

Or using systemd:
```bash
# Create service file
sudo nano /etc/systemd/system/slidetheory.service
```

Content:
```ini
[Unit]
Description=SlideTheory Node.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/slidetheory
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable slidetheory
sudo systemctl start slidetheory
sudo systemctl status slidetheory
```

---

## Post-Deployment Verification

### Check All Pages Load:

1. [ ] https://slidetheory.io (Home)
2. [ ] https://slidetheory.io/how-it-works.html
3. [ ] https://slidetheory.io/resources.html
4. [ ] https://slidetheory.io/blog.html
5. [ ] https://slidetheory.io/gallery.html
6. [ ] https://slidetheory.io/privacy.html
7. [ ] https://slidetheory.io/terms.html

### Navigation Tests:

- [ ] All internal links work between pages
- [ ] Navigation menu appears on all pages
- [ ] Mobile menu toggles correctly
- [ ] Footer links functional

### Functional Tests:

- [ ] API endpoints respond: `curl https://slidetheory.io/api/health`
- [ ] Slide generation works (if API keys configured)
- [ ] Export to PPTX/PDF works

### Performance & Security:

- [ ] SSL certificate valid: `openssl s_client -connect slidetheory.io:443`
- [ ] Mobile responsive (test with Chrome DevTools)
- [ ] Page load times under 3 seconds
- [ ] No mixed content warnings

---

## Troubleshooting

### Node.js won't start:
```bash
cd /var/www/slidetheory
npm install
node server.js  # Check error messages
```

### Nginx errors:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Permission issues:
```bash
sudo chown -R www-data:www-data /var/www/slidetheory
sudo chmod -R 755 /var/www/slidetheory
```

### PM2 logs:
```bash
pm2 logs slidetheory
pm2 monit
```

---

## Rollback Procedure

If deployment fails:

1. Stop the application:
   ```bash
   pm2 stop slidetheory
   # or
   sudo systemctl stop slidetheory
   ```

2. Restore from backup (if available):
   ```bash
   cd /var/www
   sudo mv slidetheory slidetheory-failed
   sudo tar -xzf /path/to/backup/slidetheory-backup.tar.gz
   ```

3. Restart with previous version

---

## Support

- **Documentation:** See `README.md` in deployment package
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **API Docs:** See `API.md`

---

**Deployment Package Created:** 2026-02-05
**Version:** 2.0.0
