# SlideTheory Deployment & Operations Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Deployment Procedures](#deployment-procedures)
4. [Rollback Procedures](#rollback-procedures)
5. [Monitoring & Alerting](#monitoring--alerting)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Git
- Access to deployment server(s)

### Local Development

```bash
cd products/slidetheory/deployment/docker
docker-compose up app-dev
```

### Production Deployment

```bash
# Build and push image
cd products/slidetheory/deployment/docker
./build.sh --push

# Deploy to production
ssh user@production-server
cd /opt/slidetheory
docker-compose -f deployment/docker/docker-compose.yml up -d app-prod
```

---

## Environment Setup

### Environment Files

| Environment | File | Purpose |
|-------------|------|---------|
| Development | `config/.env.development` | Local development |
| Staging | `config/.env.staging` | Pre-production testing |
| Production | `config/.env.production` | Live environment |

### Required Secrets

Create the following GitHub secrets for CI/CD:

- `PRODUCTION_SSH_KEY` - SSH private key for production server
- `PRODUCTION_HOST` - Production server hostname/IP
- `PRODUCTION_USER` - SSH username for production
- `STAGING_SSH_KEY` - SSH private key for staging server
- `STAGING_HOST` - Staging server hostname/IP
- `STAGING_USER` - SSH username for staging
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `KIMI_API_KEY` - API key for AI generation

---

## Deployment Procedures

### 1. Automated Deployment (GitHub Actions)

Deployments are triggered automatically:

- **Develop branch** → Staging environment
- **Version tags (v*)** → Production environment

### 2. Manual Deployment

```bash
# 1. Build the image
./deployment/docker/build.sh

# 2. Push to registry (if needed)
docker push ghcr.io/slidetheory/slidetheory-mvp:latest

# 3. Deploy on server
ssh user@server << 'EOF'
  cd /opt/slidetheory
  git pull origin main
  docker-compose -f deployment/docker/docker-compose.yml pull
  docker-compose -f deployment/docker/docker-compose.yml up -d
EOF

# 4. Verify deployment
curl https://slidetheory.app/api/health
```

### 3. Rolling Deployment

For zero-downtime deployments:

```bash
# Scale up new containers
docker-compose up -d --scale app-prod=3

# Wait for health check
sleep 30
curl -f http://localhost:3000/api/health

# Scale down old containers
docker-compose up -d --scale app-prod=2
```

---

## Rollback Procedures

### Automatic Rollback

The system automatically saves the previous image as `:rollback` tag before each deployment.

### Manual Rollback

#### Option 1: GitHub Actions (Recommended)

1. Go to GitHub Actions → Rollback workflow
2. Click "Run workflow"
3. Select environment (staging/production)
4. Select version to rollback to (or "rollback" for previous)

#### Option 2: Command Line

```bash
# Rollback to previous version
ssh user@production-server << 'EOF'
  cd /opt/slidetheory
  
  # Tag current as failed
docker tag ghcr.io/slidetheory/slidetheory-mvp:latest ghcr.io/slidetheory/slidetheory-mvp:failed-$(date +%Y%m%d)
  
  # Restore previous
  docker tag ghcr.io/slidetheory/slidetheory-mvp:rollback ghcr.io/slidetheory/slidetheory-mvp:latest
  
  # Restart
  docker-compose -f deployment/docker/docker-compose.yml up -d
  
  # Verify
  curl -f http://localhost:3000/api/health || echo "Rollback failed!"
EOF
```

#### Option 3: Rollback to Specific Version

```bash
ssh user@production-server << 'EOF'
  cd /opt/slidetheory
  
  # Pull specific version
  docker pull ghcr.io/slidetheory/slidetheory-mvp:v2.0.1
  
  # Tag as latest
  docker tag ghcr.io/slidetheory/slidetheory-mvp:v2.0.1 ghcr.io/slidetheory/slidetheory-mvp:latest
  
  # Restart
  docker-compose -f deployment/docker/docker-compose.yml up -d
EOF
```

### Rollback Verification

After rollback, verify:

```bash
# Check version
curl https://slidetheory.app/api/health | jq '.version'

# Check all endpoints
curl https://slidetheory.app/api/health/detailed
curl https://slidetheory.app/api/metrics
```

### Database/State Rollback

If data corruption occurred:

```bash
# Restore from backup
scp backup-analytics-20240205.json server:/opt/slidetheory/tmp/analytics.json

# Restart application
docker-compose restart app-prod
```

---

## Monitoring & Alerting

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Application | https://slidetheory.app | - |
| Grafana | http://localhost:3001 | admin/admin |
| Prometheus | http://localhost:9090 | - |
| Alertmanager | http://localhost:9093 | - |

### Health Check Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Basic health status |
| `/api/health/detailed` | Detailed system health |
| `/api/health/ready` | Kubernetes readiness probe |
| `/api/health/live` | Kubernetes liveness probe |
| `/api/metrics` | Prometheus metrics |

### Alerts

The following alerts are configured:

- **HighErrorRate** - Error rate above 10% for 2+ minutes
- **HighResponseTime** - 95th percentile response time above 5s
- **ServiceDown** - Application unreachable
- **HighMemoryUsage** - Memory usage above 85%
- **HighCPUUsage** - CPU usage above 80%
- **LowDiskSpace** - Disk space below 10%
- **SSLCertificateExpiringSoon** - SSL cert expires in 7 days

### Log Aggregation

Logs are collected via Loki and viewable in Grafana:

- Application logs: `{job="slidetheory"}`
- Nginx logs: `{job="nginx"}`
- System logs: `{job="system"}`

---

## Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker-compose logs app-prod

# Check resource usage
docker stats

# Check disk space
df -h
```

#### High Memory Usage

```bash
# Restart with more memory
docker-compose -f docker-compose.yml up -d --memory=4g app-prod

# Check for memory leaks in logs
docker-compose logs app-prod | grep -i memory
```

#### SSL Certificate Issues

```bash
# Check certificate status
./scripts/ssl-automation.sh status

# Renew certificates
./scripts/ssl-automation.sh renew

# Test renewal
./scripts/ssl-automation.sh test
```

#### Database/Storage Issues

```bash
# Check disk permissions
ls -la tmp/

# Fix permissions
chown -R 1000:1000 tmp/

# Clear old exports
find tmp/exports -mtime +1 -delete
```

### Emergency Contacts

- On-call engineer: [TBD]
- Infrastructure team: [TBD]
- Security team: [TBD]

---

## Maintenance Windows

Regular maintenance is scheduled:

- **Daily**: SSL certificate renewal check (03:00 UTC)
- **Weekly**: Log rotation and cleanup (Sunday 02:00 UTC)
- **Monthly**: Security updates (First Sunday 04:00 UTC)
