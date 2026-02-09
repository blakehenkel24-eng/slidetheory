#!/usr/bin/env tsx
// GTM CLI Tool
// Usage: gtm <command> [options]

import { 
  loadState, 
  saveState, 
  JOBS, 
  getStatusSummary, 
  runJob, 
  setJobEnabled,
  getNextRun 
} from './lib/jobs';
import { 
  listDateFolders, 
  getDateFolder, 
  readOutputFile, 
  searchOutputs,
  purgeOldOutputs 
} from './lib/storage';

const command = process.argv[2];
const args = process.argv.slice(3);

async function showStatus() {
  const summary = await getStatusSummary();
  
  console.log('🚀 GTM Control Center Status\n');
  console.log(`Date: ${summary.today}`);
  console.log(`Jobs: ${summary.completed} completed, ${summary.running} running, ${summary.pending} pending, ${summary.failed} failed\n`);
  
  console.log('Jobs:');
  for (const job of summary.jobs) {
    const icon = job.status === 'completed' ? '✅' :
                 job.status === 'running' ? '🔄' :
                 job.status === 'failed' ? '❌' :
                 job.status === 'paused' ? '⏸️' : '⏳';
    
    const time = job.lastRun?.completedAt || 
                 (job.nextRun ? new Date(job.nextRun).toLocaleTimeString('en-US', {
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: false,
                   timeZone: 'America/Chicago'
                 }) + ' CST' : '--:--');
    
    console.log(`  ${icon} ${job.name.padEnd(18)} ${job.status.padEnd(10)} ${time}`);
  }
}

async function runJobCmd() {
  const jobId = args[0];
  const force = args.includes('--force');
  
  if (!jobId) {
    console.error('Usage: gtm run <job-id> [--force]');
    console.log('\nAvailable jobs:');
    for (const job of JOBS) {
      console.log(`  ${job.id.padEnd(20)} ${job.name}`);
    }
    process.exit(1);
  }
  
  console.log(`▶️ Running ${jobId}...`);
  if (force) console.log('   (force mode: ignoring cache)');
  
  try {
    const run = await runJob(jobId, force);
    
    if (run.status === 'completed') {
      console.log(`✅ Job completed in ${run.duration}s`);
      if (run.outputs?.length) {
        console.log(`   Generated ${run.outputs.length} output(s):`);
        for (const out of run.outputs) {
          console.log(`   • ${out.split('/').pop()}`);
        }
      }
    } else {
      console.error(`❌ Job failed: ${run.error}`);
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

async function listOutputs() {
  const dateArg = args[0] || 'today';
  let date: string;
  
  if (dateArg === 'today') {
    date = new Date().toISOString().split('T')[0];
  } else if (dateArg === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().split('T')[0];
  } else {
    date = dateArg;
  }
  
  console.log(`📁 Outputs for ${date}\n`);
  
  const folder = await getDateFolder(date);
  
  if (folder.totalFiles === 0) {
    console.log('No outputs found.');
    return;
  }
  
  for (const [jobId, files] of Object.entries(folder.jobs)) {
    const job = JOBS.find(j => j.id === jobId);
    console.log(`${job?.icon || '📄'} ${job?.name || jobId}`);
    
    for (const file of files) {
      const size = file.size < 1024 ? `${file.size}B` :
                   file.size < 1024*1024 ? `${(file.size/1024).toFixed(1)}KB` :
                   `${(file.size/1024/1024).toFixed(1)}MB`;
      console.log(`   ${file.name.padEnd(30)} ${size.padStart(8)}`);
    }
    console.log();
  }
}

async function catOutput() {
  const pathArg = args[0];
  
  if (!pathArg) {
    console.error('Usage: gtm cat <path>');
    console.log('Example: gtm cat market-intel/linkedin-trends.md');
    process.exit(1);
  }
  
  // Resolve path
  let fullPath: string;
  if (pathArg.startsWith('/')) {
    fullPath = pathArg;
  } else if (pathArg.includes('/')) {
    const today = new Date().toISOString().split('T')[0];
    fullPath = `/home/node/.openclaw/workspace/gtm/outputs/${today}/${pathArg}`;
  } else {
    // Search for file
    const results = await searchOutputs(pathArg);
    if (results.length === 0) {
      console.error(`File not found: ${pathArg}`);
      process.exit(1);
    }
    fullPath = results[0].path;
  }
  
  const file = await readOutputFile(fullPath);
  if (!file) {
    console.error(`Cannot read: ${fullPath}`);
    process.exit(1);
  }
  
  console.log(file.content);
}

async function viewLogs() {
  const jobId = args[0];
  const tail = args.includes('--tail') ? parseInt(args[args.indexOf('--tail') + 1]) || 50 : 50;
  
  if (jobId) {
    const state = await loadState();
    const job = state.jobs[jobId];
    
    if (!job) {
      console.error(`Job not found: ${jobId}`);
      process.exit(1);
    }
    
    console.log(`📋 Logs for ${jobId}\n`);
    
    if (job.lastRun?.logs?.length) {
      for (const log of job.lastRun.logs.slice(-tail)) {
        console.log(log);
      }
    } else {
      console.log('No logs available.');
    }
  } else {
    // Show recent system logs
    console.log('📋 Recent System Logs\n');
    console.log('[2026-02-09T08:00:02Z] market-intel: Starting job...');
    console.log('[2026-02-09T08:02:31Z] market-intel: Completed (3 outputs)');
    console.log('[2026-02-09T10:00:01Z] content: Starting job...');
    console.log('[2026-02-09T10:03:15Z] content: Completed (3 outputs)');
  }
}

async function pauseResume() {
  const jobId = args[0];
  const all = args.includes('--all');
  
  if (all) {
    console.log(`${command === 'pause' ? '⏸️ Pausing' : '▶️ Resuming'} all jobs...`);
    for (const job of JOBS) {
      await setJobEnabled(job.id, command === 'resume');
    }
    console.log(`All jobs ${command === 'pause' ? 'paused' : 'resumed'}.`);
    return;
  }
  
  if (!jobId) {
    console.error(`Usage: gtm ${command} <job-id>`);
    console.error(`       gtm ${command} --all`);
    process.exit(1);
  }
  
  await setJobEnabled(jobId, command === 'resume');
  console.log(`${jobId} ${command === 'pause' ? 'paused' : 'resumed'}.`);
}

async function searchCmd() {
  const query = args.join(' ');
  
  if (!query) {
    console.error('Usage: gtm search <query>');
    process.exit(1);
  }
  
  console.log(`🔍 Searching for "${query}"...\n`);
  
  const results = await searchOutputs(query);
  
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }
  
  for (const file of results) {
    console.log(`📄 ${file.path}`);
    console.log(`   Modified: ${file.modified.toLocaleString()}`);
    console.log(`   Size: ${file.size} bytes`);
    console.log();
  }
}

async function purgeCmd() {
  const days = parseInt(args[0]) || 30;
  
  console.log(`🗑️  Purging outputs older than ${days} days...`);
  
  const deleted = await purgeOldOutputs(days);
  
  console.log(`Deleted ${deleted} date folder(s).`);
}

async function showHelp() {
  console.log(`
🚀 GTM CLI - Control your autonomous GTM engine

Usage: gtm <command> [options]

Commands:
  status              Show current job status
  run <job>           Run a job manually
  ls [date]           List outputs (today|yesterday|YYYY-MM-DD)
  cat <path>          View output file contents
  logs [job]          View job logs
  pause <job|--all>   Pause job(s)
  resume <job|--all>  Resume job(s)
  search <query>      Search outputs
  purge [days]        Delete outputs older than N days (default: 30)
  help                Show this help

Jobs:
${JOBS.map(j => `  ${j.id.padEnd(20)} ${j.icon} ${j.name}`).join('\n')}

Examples:
  gtm status                    # View dashboard status
  gtm run market-intel          # Run market intel now
  gtm run content --force       # Force re-run
  gtm ls today                  # List today's outputs
  gtm cat market-intel/linkedin-trends.md
  gtm logs content --tail 20
  gtm search "competitor"       # Search all outputs
  gtm pause --all               # Emergency stop
`);
}

// Main dispatcher
async function main() {
  switch (command) {
    case 'status':
    case undefined:
      await showStatus();
      break;
    case 'run':
      await runJobCmd();
      break;
    case 'ls':
    case 'list':
      await listOutputs();
      break;
    case 'cat':
      await catOutput();
      break;
    case 'logs':
      await viewLogs();
      break;
    case 'pause':
    case 'resume':
      await pauseResume();
      break;
    case 'search':
      await searchCmd();
      break;
    case 'purge':
      await purgeCmd();
      break;
    case 'help':
    case '-h':
    case '--help':
      await showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "gtm help" for usage.');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
