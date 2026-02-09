// GTM Job Definitions and State Management
// File: /gtm/lib/jobs.ts

export interface JobConfig {
  id: string;
  name: string;
  description: string;
  cron: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface JobRun {
  id: string;
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  duration?: number; // seconds
  outputs?: string[];
  error?: string;
  logs?: string[];
}

export interface JobState {
  lastUpdated: string;
  jobs: Record<string, {
    config: JobConfig;
    lastRun?: JobRun;
    nextRun?: string;
    history: JobRun[];
  }>;
}

// Job Definitions
export const JOBS: JobConfig[] = [
  {
    id: 'market-intel',
    name: 'Market Intel',
    description: 'LinkedIn trends, competitor watch, industry news',
    cron: '0 8 * * *',
    icon: '☀️',
    color: '#f59e0b',
    enabled: true,
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Blog drafts, social posts, email newsletter',
    cron: '0 10 * * *',
    icon: '✍️',
    color: '#3b82f6',
    enabled: true,
  },
  {
    id: 'prospect-research',
    name: 'Prospect Research',
    description: 'Lead qualification, outreach prep',
    cron: '0 14 * * *',
    icon: '🎯',
    color: '#8b5cf6',
    enabled: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Metrics report, funnel analysis',
    cron: '0 18 * * *',
    icon: '📊',
    color: '#10b981',
    enabled: true,
  },
  {
    id: 'health-check',
    name: 'Health Check',
    description: 'System status, API limits, storage',
    cron: '0 21 * * *',
    icon: '🏥',
    color: '#ef4444',
    enabled: true,
  },
  {
    id: 'weekly-strategy',
    name: 'Weekly Strategy',
    description: 'Strategy review and recommendations',
    cron: '0 9 * * 5',
    icon: '📅',
    color: '#6366f1',
    enabled: true,
  },
];

// State file path
const STATE_FILE = '/home/node/.openclaw/workspace/gtm/state.json';

// Load current state
export async function loadState(): Promise<JobState> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Initialize fresh state
    const state: JobState = {
      lastUpdated: new Date().toISOString(),
      jobs: {},
    };
    for (const job of JOBS) {
      state.jobs[job.id] = {
        config: job,
        history: [],
      };
    }
    return state;
  }
}

// Save state
export async function saveState(state: JobState): Promise<void> {
  const fs = await import('fs/promises');
  state.lastUpdated = new Date().toISOString();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

// Calculate next run time
export function getNextRun(cronExpr: string, timezone: string = 'America/Chicago'): string | null {
  // Simple cron parser for display purposes
  const parts = cronExpr.split(' ');
  if (parts.length !== 5) return null;
  
  const [minute, hour] = parts;
  const now = new Date();
  
  // Create next run time in CST
  const next = new Date();
  next.setUTCHours(parseInt(hour) + 6); // CST is UTC-6 (ignoring DST for simplicity)
  next.setUTCMinutes(parseInt(minute));
  next.setUTCSeconds(0);
  next.setUTCMilliseconds(0);
  
  // If time passed today, move to tomorrow
  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  
  return next.toISOString();
}

// Get status summary for dashboard
export async function getStatusSummary() {
  const state = await loadState();
  const today = new Date().toISOString().split('T')[0];
  
  const summary = {
    today,
    totalJobs: JOBS.length,
    completed: 0,
    running: 0,
    failed: 0,
    pending: 0,
    paused: 0,
    jobs: JOBS.map(job => {
      const jobState = state.jobs[job.id];
      const lastRun = jobState?.lastRun;
      const isToday = lastRun?.completedAt?.startsWith(today);
      
      return {
        ...job,
        status: lastRun?.status === 'running' ? 'running' :
                lastRun?.status === 'failed' ? 'failed' :
                isToday && lastRun?.status === 'completed' ? 'completed' :
                !job.enabled ? 'paused' : 'pending',
        lastRun: lastRun ? {
          ...lastRun,
          completedAt: lastRun.completedAt ? new Date(lastRun.completedAt).toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) + ' CST' : undefined,
        } : undefined,
        nextRun: getNextRun(job.cron),
        outputCount: lastRun?.outputs?.length || 0,
      };
    }),
  };
  
  summary.completed = summary.jobs.filter(j => j.status === 'completed').length;
  summary.running = summary.jobs.filter(j => j.status === 'running').length;
  summary.failed = summary.jobs.filter(j => j.status === 'failed').length;
  summary.pending = summary.jobs.filter(j => j.status === 'pending').length;
  summary.paused = summary.jobs.filter(j => j.status === 'paused').length;
  
  return summary;
}

// Run a job manually
export async function runJob(jobId: string, force: boolean = false): Promise<JobRun> {
  const state = await loadState();
  const job = state.jobs[jobId];
  
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }
  
  const run: JobRun = {
    id: `${jobId}-${Date.now()}`,
    jobId,
    status: 'running',
    startedAt: new Date().toISOString(),
    logs: [],
  };
  
  job.lastRun = run;
  job.history.unshift(run);
  if (job.history.length > 10) job.history.pop();
  
  await saveState(state);
  
  // Execute job script
  try {
    const { execSync } = await import('child_process');
    const scriptPath = `/home/node/.openclaw/workspace/gtm/jobs/${jobId}.ts`;
    
    // Run with tsx
    execSync(`npx tsx ${scriptPath}`, {
      timeout: 300000, // 5 minutes
      stdio: 'pipe',
    });
    
    run.status = 'completed';
    run.completedAt = new Date().toISOString();
    run.duration = Math.round((Date.now() - new Date(run.startedAt!).getTime()) / 1000);
    
    // Discover outputs
    const fs = await import('fs/promises');
    const today = new Date().toISOString().split('T')[0];
    const outputDir = `/home/node/.openclaw/workspace/gtm/outputs/${today}/${jobId}`;
    
    try {
      const files = await fs.readdir(outputDir);
      run.outputs = files.map(f => `${outputDir}/${f}`);
    } catch {
      run.outputs = [];
    }
    
  } catch (error: any) {
    run.status = 'failed';
    run.completedAt = new Date().toISOString();
    run.error = error.message;
    run.duration = Math.round((Date.now() - new Date(run.startedAt!).getTime()) / 1000);
    
    // Send alert
    await sendAlert(jobId, error.message);
  }
  
  await saveState(state);
  return run;
}

// Send failure alert
async function sendAlert(jobId: string, error: string) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  
  const message = `🔴 GTM Job Failed: ${job.name}

Error: ${error.substring(0, 200)}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST

Dashboard: http://localhost:3000/gtm`;
  
  // Log to file for now
  const fs = await import('fs/promises');
  await fs.appendFile(
    '/home/node/.openclaw/workspace/gtm/alerts.log',
    `[${new Date().toISOString()}] ${message}\n\n`
  );
}

// Pause/resume job
export async function setJobEnabled(jobId: string, enabled: boolean): Promise<void> {
  const state = await loadState();
  if (state.jobs[jobId]) {
    state.jobs[jobId].config.enabled = enabled;
    await saveState(state);
  }
}
