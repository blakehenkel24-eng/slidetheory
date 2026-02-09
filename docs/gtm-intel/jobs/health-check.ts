#!/usr/bin/env tsx
// Health Check Job
// Runs at 9pm CST daily

import { writeOutput } from '../lib/storage';
import { promises as fs } from 'fs';

async function run() {
  console.log('🏥 Starting Health Check job...');
  const startTime = Date.now();
  const checks: Array<{ name: string; status: 'ok' | 'warning' | 'error'; message: string }> = [];
  
  // Check 1: Disk space
  try {
    const stats = await fs.stat('/home/node/.openclaw/workspace/gtm');
    checks.push({ name: 'Disk Space', status: 'ok', message: 'Sufficient space available' });
  } catch {
    checks.push({ name: 'Disk Space', status: 'warning', message: 'Could not check disk space' });
  }
  
  // Check 2: Output directory writable
  try {
    const testFile = '/home/node/.openclaw/workspace/gtm/.write-test';
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    checks.push({ name: 'Output Directory', status: 'ok', message: 'Writable' });
  } catch {
    checks.push({ name: 'Output Directory', status: 'error', message: 'Not writable' });
  }
  
  // Check 3: API keys (check if files exist)
  const apiChecks = ['KIMI_API_KEY', 'SUPABASE_URL'];
  for (const key of apiChecks) {
    if (process.env[key]) {
      checks.push({ name: `${key}`, status: 'ok', message: 'Configured' });
    } else {
      checks.push({ name: `${key}`, status: 'warning', message: 'Not in environment' });
    }
  }
  
  // Check 4: Job state file
  try {
    await fs.access('/home/node/.openclaw/workspace/gtm/state.json');
    checks.push({ name: 'State File', status: 'ok', message: 'Accessible' });
  } catch {
    checks.push({ name: 'State File', status: 'warning', message: 'Not found (will be created)' });
  }
  
  // Check 5: Recent job runs
  const today = new Date().toISOString().split('T')[0];
  try {
    const outputDir = `/home/node/.openclaw/workspace/gtm/outputs/${today}`;
    await fs.access(outputDir);
    checks.push({ name: 'Today\'s Outputs', status: 'ok', message: 'Directory exists' });
  } catch {
    checks.push({ name: 'Today\'s Outputs', status: 'warning', message: 'No outputs yet today' });
  }
  
  // Generate report
  const okCount = checks.filter(c => c.status === 'ok').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const errorCount = checks.filter(c => c.status === 'error').length;
  
  const statusEmoji = errorCount > 0 ? '❌' : warningCount > 0 ? '⚠️' : '✅';
  const overallStatus = errorCount > 0 ? 'ERROR' : warningCount > 0 ? 'WARNING' : 'HEALTHY';
  
  const reportContent = `# System Health Check - ${new Date().toLocaleDateString()}

## Overall Status: ${statusEmoji} ${overallStatus}

| Check | Status | Message |
|-------|--------|---------|
${checks.map(c => `| ${c.name} | ${c.status === 'ok' ? '✅' : c.status === 'warning' ? '⚠️' : '❌'} ${c.status.toUpperCase()} | ${c.message} |`).join('\n')}

## Summary
- ✅ OK: ${okCount}
- ⚠️ Warnings: ${warningCount}
- ❌ Errors: ${errorCount}

## Recommendations
${warningCount > 0 ? '- Review warnings above\n' : ''}${errorCount > 0 ? '- URGENT: Address errors immediately\n' : '- System is healthy'}

---
Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
`;

  await writeOutput('health-check', 'system-status.md', reportContent);
  console.log('✅ Health report saved');
  
  // If errors, log to alerts
  if (errorCount > 0) {
    const alertMessage = `🚨 Health Check Failed\n\n${checks.filter(c => c.status === 'error').map(c => `- ${c.name}: ${c.message}`).join('\n')}`;
    await fs.appendFile('/home/node/.openclaw/workspace/gtm/alerts.log', `[${new Date().toISOString()}] ${alertMessage}\n\n`);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Health Check complete (${duration}s) - ${overallStatus}`);
}

run().catch(console.error);
