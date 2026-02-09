# GTM Automation Engine

> Autonomous go-to-market system for SlideTheory  
> Philosophy: **Silent success, noisy failure**

## Quick Start

```bash
cd /home/node/.openclaw/workspace/gtm
npm install

# Start the scheduler (runs jobs automatically)
npm run scheduler

# Or view dashboard
npm run dashboard
```

## CLI Commands

```bash
# View status
npm run cli -- status

# Run a job manually
npm run cli -- run market-intel
npm run cli -- run content --force

# List outputs
npm run cli -- ls today
npm run cli -- ls 2026-02-09

# View output file
npm run cli -- cat market-intel/linkedin-trends.md

# Search outputs
npm run cli -- search "competitor"

# View logs
npm run cli -- logs
npm run cli -- logs content --tail 20

# Pause/resume
npm run cli -- pause content
npm run cli -- resume content
npm run cli -- pause --all
```

## Job Schedule (CST)

| Time | Job | Description |
|------|-----|-------------|
| 08:00 | ☀️ Market Intel | LinkedIn trends, competitor watch, industry news |
| 10:00 | ✍️ Content | Blog drafts, social posts, email newsletter |
| 14:00 | 🎯 Prospect Research | Lead qualification, outreach prep |
| 18:00 | 📊 Analytics | Metrics report, funnel analysis |
| 21:00 | 🏥 Health Check | System status, API limits, storage |
| Fri 09:00 | 📅 Weekly Strategy | Strategy review and recommendations |

## Directory Structure

```
/gtm/
├── dashboard/          # Web UI (open index.html)
├── jobs/              # Job scripts (one per job)
├── lib/               # Shared utilities
├── outputs/           # Generated content (dated subfolders)
├── logs/              # Execution logs
├── cli.ts             # Command-line tool
├── scheduler.ts       # Cron scheduler
└── state.json         # Job state (auto-created)
```

## Dashboard

Open `dashboard/index.html` in a browser for the visual control center:
- See all job statuses at a glance
- Run jobs manually
- View recent outputs
- Access logs

## Alert Patterns

| Scenario | Alert | Channel |
|----------|-------|---------|
| Job completes | 🟢 None | — |
| Job fails | 🔴 Immediate | Telegram + Dashboard |
| 2+ failures | 🔴🔴 Urgent | Telegram + Email |
| Health check fails | 🔴 Immediate | Telegram + Dashboard |
| Weekly ready | 🟢 Notify | Telegram (Fri 9am) |

## Adding New Jobs

1. Create `jobs/your-job.ts`
2. Add to `lib/jobs.ts` JOBS array
3. Restart scheduler

## Environment Variables

Create `.env` in the gtm directory:
```
KIMI_API_KEY=your_key_here
SUPABASE_URL=your_url_here
TELEGRAM_BOT_TOKEN=your_token_here
```

## Maintenance

```bash
# Clean old outputs (default: keep 30 days)
npm run cli -- purge 30

# View system health
npm run cli -- run health-check
```

---

*Built for Blake's SlideTheory GTM automation*
