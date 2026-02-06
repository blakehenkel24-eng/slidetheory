# SlideTheory Production Deployment

Complete production deployment infrastructure for SlideTheory.

## 📁 Structure

```
deployment/
├── docker/                 # Docker containerization
│   ├── Dockerfile          # Multi-stage build
│   ├── docker-compose.yml  # Compose orchestration
│   └── nginx/              # Nginx configuration
├── github-actions/         # CI/CD pipelines
│   ├── deploy.yml          # Main deployment workflow
│   └── rollback.yml        # Rollback workflow
├── config/                 # Environment configurations
│   ├── .env.development
│   ├── .env.staging
│   └── .env.production
├── monitoring/             # Observability stack
│   ├── docker-compose.monitoring.yml
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yml
│   ├── ingress.yml
│   └── namespace.yml
├── scripts/                # Automation scripts
│   └── ssl-automation.sh
└── OPERATIONS.md           # Operations guide
```

## 🚀 Quick Start

### Docker Deployment

```bash
cd deployment/docker

# Development
docker-compose up app-dev

# Staging
docker-compose up app-staging

# Production
docker-compose up -d app-prod nginx
```

### Kubernetes Deployment

```bash
cd deployment/k8s

# Apply manifests
kubectl apply -f namespace.yml
kubectl apply -f deployment.yml
kubectl apply -f ingress.yml

# Check status
kubectl get pods -n slidetheory
kubectl get svc -n slidetheory
kubectl get ingress -n slidetheory
```

## 🔄 CI/CD Pipeline

GitHub Actions automatically:

1. **Test** - Runs on every PR
2. **Build** - Creates Docker image on push to main/develop
3. **Deploy** - Staging (develop branch) / Production (tags)
4. **Notify** - Sends Slack notifications

### Manual Triggers

- **Deploy**: Push to `develop` or tag with `v*`
- **Rollback**: Run "Rollback" workflow in GitHub Actions

## 📊 Monitoring

### Start Monitoring Stack

```bash
cd deployment/monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### Access Dashboards

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| Alertmanager | http://localhost:9093 |

### Health Endpoints

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/detailed
curl http://localhost:3000/api/metrics
```

## 🔒 SSL Certificates

### Automatic (Let's Encrypt + Certbot)

```bash
sudo ./scripts/ssl-automation.sh setup
```

### Check Status

```bash
./scripts/ssl-automation.sh status
```

### Manual Renewal

```bash
sudo ./scripts/ssl-automation.sh renew
```

## 📋 Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Secrets added to GitHub
- [ ] Domain DNS configured
- [ ] Server provisioned
- [ ] Docker installed

### Post-Deployment

- [ ] Health checks passing
- [ ] SSL certificates valid
- [ ] Monitoring accessible
- [ ] Alerts configured
- [ ] Rollback tested

## 🆘 Emergency Procedures

### Rollback

```bash
# Via GitHub Actions
# 1. Go to Actions → Rollback
# 2. Select environment
# 3. Run workflow

# Via CLI
ssh user@production-server
cd /opt/slidetheory
./scripts/rollback.sh
```

### Scale Up

```bash
docker-compose up -d --scale app-prod=5
```

### Restart Services

```bash
docker-compose restart app-prod nginx
```

## 📚 Documentation

- [Operations Guide](OPERATIONS.md) - Detailed operations procedures
- [Architecture](../../mvp/build/ARCHITECTURE.md) - Application architecture
- [API Docs](../../mvp/build/API.md) - API documentation

## 🔧 Configuration

### Environment Variables

See `config/` directory for environment-specific configurations.

### Required Secrets

Create a `.env.secrets` file (never commit):

```bash
KIMI_API_KEY=your_key_here
SLACK_WEBHOOK_URL=your_webhook_url
```

## 📞 Support

For deployment issues:

1. Check logs: `docker-compose logs -f app-prod`
2. Review [Operations Guide](OPERATIONS.md)
3. Check monitoring dashboards
4. Contact: [devops@slidetheory.app]
