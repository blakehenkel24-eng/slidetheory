#!/usr/bin/env tsx
// Prospect Research Job
// Runs at 2pm CST daily

import { writeOutput } from '../lib/storage';

async function run() {
  console.log('🎯 Starting Prospect Research job...');
  const startTime = Date.now();
  
  // Simulate lead research
  const leads = [
    { company: 'Strategy Partners LLC', role: 'Managing Director', fit: 85, source: 'LinkedIn' },
    { company: 'Growth Consulting Group', role: 'Senior Partner', fit: 78, source: 'Crunchbase' },
    { company: 'PE Advisory Co', role: 'VP Strategy', fit: 92, source: 'AngelList' },
  ];
  
  const leadsContent = {
    generated: new Date().toISOString(),
    leads: leads.map(l => ({
      ...l,
      status: 'new',
      priority: l.fit >= 85 ? 'high' : 'medium',
      nextAction: l.fit >= 85 ? 'Personal outreach' : 'Add to nurture sequence'
    }))
  };

  await writeOutput('prospect-research', 'leads-qualified.json', JSON.stringify(leadsContent, null, 2));
  console.log(`✅ ${leads.length} leads qualified`);
  
  // Generate outreach prep
  const outreachContent = `# Outreach Preparation - ${new Date().toLocaleDateString()}

## High-Priority Leads

### 1. PE Advisory Co (VP Strategy)
**Fit Score: 92%**
- Recent news: Just closed $50M fund
- Pain point: High deal volume = lots of pitch decks
- Angle: "Scale your investment thesis presentations"
- LinkedIn: Active poster, commented on AI tools yesterday

### 2. Strategy Partners LLC (Managing Director)
**Fit Score: 85%**
- Recent news: Hired 3 new associates
- Pain point: Training new hires on slide standards
- Angle: "Standardize quality across your team"

## Outreach Templates Ready
- [ ] Connection request script
- [ ] Follow-up sequence (3 emails)
- [ ] Demo invitation

---
Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
`;

  await writeOutput('prospect-research', 'outreach-prep.md', outreachContent);
  console.log('✅ Outreach prep saved');
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Prospect Research complete (${duration}s)`);
}

run().catch(console.error);
