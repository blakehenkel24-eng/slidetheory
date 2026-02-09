#!/usr/bin/env tsx
// Analytics Job
// Runs at 6pm CST daily

import { writeOutput } from '../lib/storage';

async function run() {
  console.log('📊 Starting Analytics job...');
  const startTime = Date.now();
  
  // Simulate metrics collection
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const metrics = {
    visitors: { today: 142, yesterday: 128, change: '+11%' },
    signups: { today: 8, yesterday: 5, change: '+60%' },
    activations: { today: 3, yesterday: 2, change: '+50%' },
    slidesGenerated: { today: 47, yesterday: 38, change: '+24%' },
    revenue: { today: 0, yesterday: 0, change: '0%' },
  };
  
  // Generate metrics report
  const reportContent = `# Daily Metrics Report - ${today.toLocaleDateString()}

## Summary
| Metric | Today | Yesterday | Change |
|--------|-------|-----------|--------|
| Visitors | ${metrics.visitors.today} | ${metrics.visitors.yesterday} | ${metrics.visitors.change} |
| Signups | ${metrics.signups.today} | ${metrics.signups.yesterday} | ${metrics.signups.change} |
| Activations | ${metrics.activations.today} | ${metrics.activations.yesterday} | ${metrics.activations.change} |
| Slides Generated | ${metrics.slidesGenerated.today} | ${metrics.slidesGenerated.yesterday} | ${metrics.slidesGenerated.change} |

## Key Insights
- Signup rate improved (5.6% vs 3.9%)
- Activation rate holding steady at 37.5%
- Revenue still at $0 - need paid tier

## 7-Day Trend
Signups:    42 total (+15% vs last week)
Activation: 18 total (+20% vs last week)

## Action Items
1. [ ] A/B test pricing page
2. [ ] Follow up with 8 non-activated signups
3. [ ] Double down on content that's driving traffic

---
Generated: ${today.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
`;

  await writeOutput('analytics', 'metrics-report.md', reportContent);
  console.log('✅ Metrics report saved');
  
  // Funnel analysis
  const funnelContent = {
    date: today.toISOString(),
    stages: [
      { name: 'Visitor', count: 142, dropoff: 0 },
      { name: 'Signup', count: 8, dropoff: 94, rate: 5.6 },
      { name: 'Activation', count: 3, dropoff: 62, rate: 37.5 },
      { name: 'Paid', count: 0, dropoff: 100, rate: 0 },
    ],
    bottleneck: 'Paid conversion (no pricing page yet)',
    recommendation: 'Launch paid tier with $29/month starter plan'
  };

  await writeOutput('analytics', 'funnel-analysis.json', JSON.stringify(funnelContent, null, 2));
  console.log('✅ Funnel analysis saved');
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Analytics complete (${duration}s)`);
}

run().catch(console.error);
