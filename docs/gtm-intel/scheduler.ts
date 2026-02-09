#!/usr/bin/env tsx
// GTM Scheduler - Cron job runner
// This script runs continuously and executes jobs according to schedule

import { CronJob } from 'cron';
import { JOBS, runJob, loadState } from './lib/jobs';

console.log('🚀 GTM Scheduler Starting...');
console.log(`Timezone: America/Chicago (CST)`);
console.log(`Jobs: ${JOBS.length} configured\n`);

// Create cron jobs
const cronJobs: CronJob[] = [];

for (const jobConfig of JOBS) {
  const job = new CronJob(
    jobConfig.cron,
    async () => {
      // Check if job is enabled
      const state = await loadState();
      const jobState = state.jobs[jobConfig.id];
      
      if (!jobState?.config.enabled) {
        console.log(`⏭️ ${jobConfig.id} is disabled, skipping`);
        return;
      }
      
      console.log(`▶️ Starting scheduled job: ${jobConfig.name}`);
      const startTime = Date.now();
      
      try {
        const run = await runJob(jobConfig.id);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (run.status === 'completed') {
          console.log(`✅ ${jobConfig.name} completed in ${duration}s`);
        } else {
          console.error(`❌ ${jobConfig.name} failed: ${run.error}`);
        }
      } catch (err: any) {
        console.error(`❌ ${jobConfig.name} error: ${err.message}`);
      }
    },
    null, // onComplete
    false, // start immediately
    'America/Chicago' // timezone
  );
  
  cronJobs.push(job);
  
  // Calculate next run
  const nextDate = job.nextDate();
  console.log(`${jobConfig.icon} ${jobConfig.name.padEnd(20)} ${jobConfig.cron.padEnd(12)} Next: ${nextDate.toISO()}`);
}

console.log('\n⏰ Scheduler is running...');
console.log('Press Ctrl+C to stop\n');

// Start all jobs
cronJobs.forEach(j => j.start());

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down scheduler...');
  cronJobs.forEach(j => j.stop());
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down scheduler...');
  cronJobs.forEach(j => j.stop());
  process.exit(0);
});

// Keep process alive
setInterval(() => {}, 1000 * 60 * 60);
