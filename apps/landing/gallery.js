/**
 * SlideTheory Template Gallery
 * Browsable template gallery with filtering, favorites, and ratings
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  templates: [],
  filteredTemplates: [],
  favorites: [],
  ratings: {},
  recentlyUsed: [],
  currentTemplate: null,
  filters: {
    type: '',
    audience: '',
    useCase: ''
  },
  showingFavorites: false
};

// ============================================
// TEMPLATE DATA - 6 Slide Types with Sample Data
// ============================================

const TEMPLATE_DATA = [
  {
    id: 'executive-summary-standard',
    name: 'Executive Summary',
    category: 'Strategy',
    icon: '📊',
    description: 'Classic executive summary with key points and recommendation',
    slideType: 'Executive Summary',
    targetAudience: 'C-Suite/Board',
    useCase: 'Board',
    framework: 'Pyramid Principle',
    rating: 4.8,
    ratingCount: 127,
    sampleData: {
      title: 'Q4 2024 Strategic Review',
      subtitle: 'Performance highlights and 2025 priorities',
      keyPoints: [
        { heading: 'Revenue Growth', text: 'Achieved 28% YoY growth, exceeding target by 8 percentage points driven by enterprise expansion.' },
        { heading: 'Market Position', text: 'Secured #2 market position in APAC with 15% market share, up from 8% in Q4 2023.' },
        { heading: 'Operational Efficiency', text: 'Reduced unit costs by 12% through automation initiatives and supplier renegotiation.' }
      ],
      recommendation: 'Accelerate international expansion with $50M Series C funding to capture emerging market opportunities.',
      footer: { source: 'Company Financials', date: 'December 2024' }
    }
  },
  {
    id: 'market-analysis-comprehensive',
    name: 'Market Analysis',
    category: 'Strategy',
    icon: '🌍',
    description: 'Market sizing, trends, and competitive landscape',
    slideType: 'Market Analysis',
    targetAudience: 'PE/Investors',
    useCase: 'Due Diligence',
    framework: 'TAM/SAM/SOM',
    rating: 4.6,
    ratingCount: 89,
    sampleData: {
      title: 'Global SaaS CRM Market Analysis',
      marketSize: '$78.2B',
      insights: [
        'Market growing at 14.2% CAGR through 2028',
        'Mid-market segment showing highest growth at 18%',
        'AI integration becoming table stakes by 2025'
      ],
      chartData: {
        labels: ['2022', '2023', '2024', '2025E', '2026E', '2027E'],
        values: [58, 64, 78, 89, 102, 117]
      },
      footer: { source: 'Gartner, McKinsey Analysis', date: 'Q4 2024' }
    }
  },
  {
    id: 'financial-model-detailed',
    name: 'Financial Model',
    category: 'Financial',
    icon: '💰',
    description: 'Multi-year financial projections with key metrics',
    slideType: 'Financial Model',
    targetAudience: 'PE/Investors',
    useCase: 'Pitch Deck',
    framework: 'Waterfall Chart',
    rating: 4.9,
    ratingCount: 156,
    sampleData: {
      title: '5-Year Financial Projections',
      metrics: [
        { label: 'Revenue (2029E)', value: '$245M', change: '+42% YoY', positive: true },
        { label: 'EBITDA Margin', value: '24%', change: '+6pp from 2028', positive: true },
        { label: 'Free Cash Flow', value: '$42M', change: 'FCF positive since 2027', positive: true }
      ],
      tableData: {
        headers: ['Metric', '2025E', '2026E', '2027E', '2028E', '2029E'],
        rows: [
          ['Revenue ($M)', '85', '128', '172', '198', '245'],
          ['Gross Margin', '68%', '70%', '71%', '72%', '73%'],
          ['OpEx ($M)', '52', '68', '82', '92', '108'],
          ['EBITDA ($M)', '6', '22', '40', '50', '59']
        ]
      },
      footer: { source: 'Management Projections', date: 'December 2024' }
    }
  },
  {
    id: 'competitive-analysis-matrix',
    name: 'Competitive Analysis',
    category: 'Strategy',
    icon: '⚔️',
    description: '2x2 matrix and feature comparison table',
    slideType: 'Competitive Analysis',
    targetAudience: 'External Client',
    useCase: 'Strategy',
    framework: '2x2 Matrix',
    rating: 4.7,
    ratingCount: 112,
    sampleData: {
      title: 'Competitive Positioning: AI Writing Tools',
      matrixTitle: 'Innovation vs. Market Presence',
      xAxis: { low: 'Niche', high: 'Broad' },
      yAxis: { low: 'Basic AI', high: 'Advanced AI' },
      competitors: [
        { name: 'SlideTheory', xPosition: 75, yPosition: 80, features: [true, true, true, true] },
        { name: 'Competitor A', xPosition: 25, yPosition: 70, features: [true, false, true, false] },
        { name: 'Competitor B', xPosition: 60, yPosition: 40, features: [false, true, false, true] },
        { name: 'Competitor C', xPosition: 40, yPosition: 30, features: [true, false, false, false] }
      ],
      features: ['MBB Templates', 'AI Generation', 'Export PPTX', 'Analytics'],
      footer: { source: 'Industry Analysis', date: 'Q4 2024' }
    }
  },
  {
    id: 'growth-strategy-flywheel',
    name: 'Growth Strategy',
    category: 'Strategy',
    icon: '🚀',
    description: 'Flywheel model with strategic initiatives',
    slideType: 'Growth Strategy',
    targetAudience: 'C-Suite/Board',
    useCase: 'Strategy',
    framework: 'MECE',
    rating: 4.5,
    ratingCount: 78,
    sampleData: {
      title: 'Customer Growth Flywheel 2025',
      flywheelTitle: 'The Growth Flywheel',
      flywheel: [
        { label: 'Attract \nContent \u0026 SEO' },
        { label: 'Engage \nProduct \nExperience' },
        { label: 'Convert \nSales \u0026 Pricing' },
        { label: 'Retain \nCS \u0026 Expansion' }
      ],
      initiatives: [
        { title: 'Content Engine', description: 'Scale content production 3x with AI assistance and editorial workflow' },
        { title: 'Product-Led Growth', description: 'Implement freemium tier and in-app upgrade flows to reduce CAC' },
        { title: 'Enterprise Sales', description: 'Build dedicated enterprise team for $50K+ ACV opportunities' }
      ],
      footer: { source: 'Strategic Planning', date: 'December 2024' }
    }
  },
  {
    id: 'risk-assessment-matrix',
    name: 'Risk Assessment',
    category: 'Strategy',
    icon: '⚠️',
    description: 'Risk matrix and mitigation strategies',
    slideType: 'Risk Assessment',
    targetAudience: 'Board',
    useCase: 'Board',
    framework: 'Risk Matrix',
    rating: 4.4,
    ratingCount: 65,
    sampleData: {
      title: 'Risk Assessment: International Expansion',
      risks: [
        { name: 'Regulatory Changes', probability: 'High', impact: 'High' },
        { name: 'Currency Fluctuation', probability: 'High', impact: 'Medium' },
        { name: 'Talent Acquisition', probability: 'Medium', impact: 'Medium' },
        { name: 'Local Competition', probability: 'Medium', impact: 'Low' },
        { name: 'Supply Chain', probability: 'Low', impact: 'High' }
      ],
      mitigations: [
        { risk: 'Regulatory Changes', level: 'high', action: 'Engage local legal counsel and build compliance buffer' },
        { risk: 'Currency Risk', level: 'medium', action: 'Implement hedging strategy for 80% of projected revenue' },
        { risk: 'Talent Acquisition', level: 'medium', action: 'Partner with local universities and offer equity incentives' }
      ],
      footer: { source: 'Risk Committee', date: 'December 2024' }
    }
  }
];

// ============================================
// SLIDE STYLES
// ============================================

const SLIDE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    width: 1200px;
    height: 750px;
    overflow: hidden;
    background: #ffffff;
  }
  
  .slide {
    width: 100%;
    height: 100%;
    padding: 60px 80px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  
  .slide-header {
    border-bottom: 3px solid #0d2137;
    padding-bottom: 24px;
    margin-bottom: 40px;
  }
  
  .slide-title {
    font-size: 52px;
    font-weight: 700;
    color: #0d2137;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  
  .slide-subtitle {
    font-size: 28px;
    font-weight: 300;
    color: #52525b;
    margin-top: 12px;
  }
  
  .slide-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  /* Executive Summary */
  .key-points { display: flex; flex-direction: column; gap: 32px; }
  .key-point { display: flex; align-items: flex-start; gap: 20px; }
  .point-marker {
    width: 48px; height: 48px; background: #0d2137; color: white;
    border-radius: 4px; display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 700; flex-shrink: 0;
  }
  .point-content h3 { font-size: 24px; font-weight: 600; color: #0d2137; margin-bottom: 8px; }
  .point-content p { font-size: 18px; color: #52525b; line-height: 1.6; }
  .recommendation-box {
    background: #0d2137; color: white; padding: 32px 40px;
    border-radius: 8px; margin-top: 40px;
  }
  .recommendation-label {
    font-size: 14px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.1em; opacity: 0.8; margin-bottom: 12px;
  }
  .recommendation-text { font-size: 24px; font-weight: 500; line-height: 1.4; }
  
  /* Market Analysis */
  .market-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; flex: 1; }
  .market-info { display: flex; flex-direction: column; gap: 32px; }
  .market-size-box {
    background: #f4f4f5; padding: 32px; border-radius: 8px;
    border-left: 4px solid #0d2137;
  }
  .market-size-label {
    font-size: 14px; font-weight: 600; color: #71717a;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
  }
  .market-size-value { font-size: 42px; font-weight: 700; color: #0d2137; }
  .insights-list { list-style: none; }
  .insights-list li {
    font-size: 20px; color: #3f3f46; padding: 16px 0;
    border-bottom: 1px solid #e4e4e7; display: flex; align-items: center; gap: 16px;
  }
  .insights-list li::before { content: "→"; color: #0d2137; font-weight: 700; }
  .chart-container {
    background: #fafafa; border-radius: 8px; padding: 32px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 1px solid #e4e4e7;
  }
  .chart-placeholder {
    width: 100%; height: 300px; display: flex;
    align-items: flex-end; justify-content: center; gap: 40px; padding: 20px;
  }
  .bar {
    width: 80px; background: linear-gradient(180deg, #334e68 0%, #0d2137 100%);
    border-radius: 4px 4px 0 0; position: relative;
  }
  .bar-label {
    position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
    font-size: 14px; font-weight: 600; color: #71717a; white-space: nowrap;
  }
  .bar-value {
    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
    font-size: 16px; font-weight: 700; color: #0d2137;
  }
  
  /* Financial Model */
  .metrics-row { display: flex; gap: 32px; margin-bottom: 40px; }
  .metric-card {
    flex: 1; background: #fafafa; padding: 28px 32px;
    border-radius: 8px; border-top: 4px solid #0d2137;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .metric-label {
    font-size: 14px; font-weight: 600; color: #71717a;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
  }
  .metric-value { font-size: 36px; font-weight: 700; color: #0d2137; margin-bottom: 8px; }
  .metric-change { font-size: 16px; font-weight: 600; }
  .metric-change.positive { color: #16a34a; }
  .metric-change.negative { color: #dc2626; }
  .table-container {
    background: #fafafa; border-radius: 8px; overflow: hidden;
    margin-top: auto; border: 1px solid #e4e4e7;
  }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    background: #0d2137; color: white; font-size: 16px;
    font-weight: 600; padding: 20px 24px; text-align: left;
  }
  .data-table td {
    font-size: 18px; padding: 20px 24px;
    border-bottom: 1px solid #e4e4e7; color: #3f3f46;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:nth-child(even) { background: #f4f4f5; }
  
  /* Competitive Analysis */
  .competitive-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; flex: 1; }
  .matrix-container {
    background: #fafafa; border: 1px solid #e4e4e7;
    border-radius: 8px; padding: 40px; position: relative;
  }
  .matrix-title {
    font-size: 18px; font-weight: 600; color: #0d2137;
    margin-bottom: 24px; text-align: center;
  }
  .matrix { position: relative; width: 100%; height: 400px; }
  .matrix-axis {
    position: absolute; font-size: 14px; font-weight: 600; color: #71717a;
  }
  .matrix-axis.x-left { bottom: -30px; left: 0; }
  .matrix-axis.x-right { bottom: -30px; right: 0; }
  .matrix-axis.y-bottom { left: -80px; bottom: 0; transform: rotate(-90deg); transform-origin: left center; }
  .matrix-axis.y-top { left: -80px; top: 0; transform: rotate(-90deg); transform-origin: left center; }
  .matrix-quadrants {
    position: absolute; inset: 0; display: grid;
    grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
  }
  .quadrant {
    border: 1px dashed #d4d4d8; display: flex;
    align-items: center; justify-content: center; font-size: 14px; color: #a1a1aa;
  }
  .matrix-bubble {
    position: absolute; padding: 12px 20px; background: #0d2137;
    color: white; border-radius: 8px; font-size: 14px;
    font-weight: 600; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .matrix-bubble.us { background: #2563eb; }
  .comparison-table { width: 100%; border-collapse: collapse; }
  .comparison-table th {
    background: #0d2137; color: white; font-size: 14px;
    font-weight: 600; padding: 16px; text-align: left;
  }
  .comparison-table td { font-size: 16px; padding: 16px; border-bottom: 1px solid #e4e4e7; }
  .comparison-table tr:nth-child(even) { background: #f4f4f5; }
  .check { color: #16a34a; font-weight: bold; }
  .cross { color: #dc2626; }
  
  /* Growth Strategy */
  .growth-container { display: flex; flex-direction: column; gap: 40px; flex: 1; }
  .flywheel-container {
    display: flex; align-items: center; justify-content: center; gap: 40px;
  }
  .flywheel-item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .flywheel-circle {
    width: 140px; height: 140px; background: #0d2137; color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    text-align: center; padding: 20px; font-size: 14px; font-weight: 600;
    box-shadow: 0 4px 12px rgba(13, 33, 55, 0.2);
  }
  .flywheel-arrow { font-size: 32px; color: #0d2137; }
  .initiatives-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .initiative-card {
    background: #f4f4f5; padding: 24px; border-radius: 8px;
    border-left: 4px solid #0d2137;
  }
  .initiative-number { font-size: 32px; font-weight: 700; color: #0d2137; margin-bottom: 8px; }
  .initiative-title { font-size: 18px; font-weight: 600; color: #0d2137; margin-bottom: 8px; }
  .initiative-desc { font-size: 14px; color: #52525b; line-height: 1.5; }
  
  /* Risk Assessment */
  .risk-container { display: flex; flex-direction: column; gap: 32px; flex: 1; }
  .risk-matrix {
    display: grid; grid-template-columns: 100px repeat(3, 1fr);
    grid-template-rows: 40px repeat(3, 1fr); gap: 8px; height: 360px;
  }
  .risk-matrix-header {
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #71717a;
  }
  .risk-matrix-label {
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #3f3f46;
  }
  .risk-cell { border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
  .risk-cell.low { background: #dcfce7; }
  .risk-cell.medium { background: #fef9c3; }
  .risk-cell.high { background: #fee2e2; }
  .risk-cell-title {
    font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: #3f3f46;
  }
  .risk-item {
    font-size: 13px; padding: 6px 10px;
    background: rgba(255, 255, 255, 0.8); border-radius: 4px; font-weight: 500;
  }
  .mitigation-table { width: 100%; border-collapse: collapse; }
  .mitigation-table th {
    background: #0d2137; color: white; font-size: 14px;
    font-weight: 600; padding: 16px; text-align: left;
  }
  .mitigation-table td { font-size: 15px; padding: 16px; border-bottom: 1px solid #e4e4e7; color: #3f3f46; }
  .mitigation-table tr:nth-child(even) { background: #f4f4f5; }
  .risk-badge {
    display: inline-block; padding: 4px 12px; border-radius: 4px;
    font-size: 12px; font-weight: 600; text-transform: uppercase;
  }
  .risk-badge.high { background: #fee2e2; color: #dc2626; }
  .risk-badge.medium { background: #fef9c3; color: #a16207; }
  .risk-badge.low { background: #dcfce7; color: #16a34a; }
  
  /* Footer */
  .slide-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 24px; border-top: 1px solid #e4e4e7;
    margin-top: auto; font-size: 14px; color: #a1a1aa;
  }
  .footer-left { display: flex; gap: 24px; }
  .confidential {
    font-weight: 600; color: #71717a;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
`;

// ============================================
// SLIDE BUILDERS
// ============================================

function buildExecutiveSummaryHTML(content) {
  const keyPointsHTML = (content.keyPoints || []).map((point, i) => `
    <div class="key-point">
      <div class="point-marker">${i + 1}</div>
      <div class="point-content">
        <h3>${point.heading}</h3>
        <p>${point.text}</p>
      </div>
    </div>
  `).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title}</h1>
        ${content.subtitle ? `<p class="slide-subtitle">${content.subtitle}</p>` : ''}
      </div>
      <div class="slide-content">
        <div class="key-points">${keyPointsHTML}</div>
        ${content.recommendation ? `
        <div class="recommendation-box">
          <div class="recommendation-label">Recommendation</div>
          <div class="recommendation-text">${content.recommendation}</div>
        </div>` : ''}
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildMarketAnalysisHTML(content) {
  const insightsHTML = (content.insights || []).map(insight => `
    <li>${insight}</li>
  `).join('');
  
  const chartData = content.chartData || { labels: ['A', 'B', 'C'], values: [30, 40, 30] };
  const maxValue = Math.max(...chartData.values);
  const barsHTML = chartData.labels.map((label, i) => {
    const value = chartData.values[i];
    const height = (value / maxValue) * 250;
    return `
      <div class="bar" style="height: ${height}px;">
        <span class="bar-value">$${value}B</span>
        <span class="bar-label">${label}</span>
      </div>
    `;
  }).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title}</h1>
      </div>
      <div class="slide-content">
        <div class="market-grid">
          <div class="market-info">
            ${content.marketSize ? `
            <div class="market-size-box">
              <div class="market-size-label">Total Addressable Market</div>
              <div class="market-size-value">${content.marketSize}</div>
            </div>` : ''}
            <ul class="insights-list">${insightsHTML}</ul>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">${barsHTML}</div>
          </div>
        </div>
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildFinancialModelHTML(content) {
  const metricsHTML = (content.metrics || []).map(metric => {
    const isPositive = metric.positive;
    return `
      <div class="metric-card">
        <div class="metric-label">${metric.label}</div>
        <div class="metric-value">${metric.value}</div>
        <div class="metric-change ${isPositive ? 'positive' : 'negative'}">
          ${metric.change}
        </div>
      </div>
    `;
  }).join('');
  
  const tableData = content.tableData || { headers: [], rows: [] };
  const headersHTML = tableData.headers.map(h => `<th>${h}</th>`).join('');
  const rowsHTML = tableData.rows.map(row => `
    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
  `).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title}</h1>
      </div>
      <div class="slide-content">
        <div class="metrics-row">${metricsHTML}</div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr>${headersHTML}</tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>
        </div>
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildCompetitiveAnalysisHTML(content) {
  const competitors = content.competitors || [];
  
  const bubblesHTML = competitors.map((comp) => {
    const isUs = comp.name.toLowerCase().includes('slide');
    return `
      <div class="matrix-bubble ${isUs ? 'us' : ''}" style="left: ${comp.xPosition}%; top: ${100 - comp.yPosition}%; transform: translate(-50%, -50%);">
        ${comp.name}
      </div>
    `;
  }).join('');
  
  const features = content.features || [];
  const tableHeaders = ['Company', ...features].map(h => `<th>${h}</th>`).join('');
  
  const tableRows = competitors.map(comp => {
    const cells = [comp.name];
    features.forEach((feat, i) => {
      const hasFeature = comp.features?.[i] || false;
      cells.push(hasFeature ? '<span class="check">✓</span>' : '<span class="cross">—</span>');
    });
    return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
  }).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title || 'Competitive Positioning'}</h1>
      </div>
      <div class="slide-content">
        <div class="competitive-grid">
          <div class="matrix-container">
            <div class="matrix-title">${content.matrixTitle || 'Competitive Matrix'}</div>
            <div class="matrix">
              <div class="matrix-axis x-left">${content.xAxis?.low || 'Low'}</div>
              <div class="matrix-axis x-right">${content.xAxis?.high || 'High'}</div>
              <div class="matrix-axis y-bottom">${content.yAxis?.low || 'Low'}</div>
              <div class="matrix-axis y-top">${content.yAxis?.high || 'High'}</div>
              <div class="matrix-quadrants">
                <div class="quadrant"></div><div class="quadrant"></div>
                <div class="quadrant"></div><div class="quadrant"></div>
              </div>
              ${bubblesHTML}
            </div>
          </div>
          <div class="comparison-table-container">
            <table class="comparison-table">
              <thead><tr>${tableHeaders}</tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
        </div>
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildGrowthStrategyHTML(content) {
  const flywheelItems = content.flywheel || [];
  
  const flywheelHTML = flywheelItems.map((item, i) => {
    const isLast = i === flywheelItems.length - 1;
    return `
      <div class="flywheel-item">
        <div class="flywheel-circle">${item.label.replace(/\\n/g, '<br>')}</div>
        ${!isLast ? '<div class="flywheel-arrow">→</div>' : ''}
      </div>
    `;
  }).join('');
  
  const initiatives = content.initiatives || [];
  const initiativesHTML = initiatives.map((init, i) => `
    <div class="initiative-card">
      <div class="initiative-number">${i + 1}</div>
      <div class="initiative-title">${init.title}</div>
      <div class="initiative-desc">${init.description}</div>
    </div>
  `).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title || 'Growth Strategy'}</h1>
      </div>
      <div class="slide-content">
        <div class="growth-container">
          ${content.flywheelTitle ? `<div style="font-size: 18px; font-weight: 600; color: #71717a; text-align: center;">${content.flywheelTitle}</div>` : ''}
          <div class="flywheel-container">${flywheelHTML}</div>
          ${initiatives.length > 0 ? `<div style="font-size: 18px; font-weight: 600; color: #0d2137; margin-top: 20px;">Strategic Initiatives</div>` : ''}
          <div class="initiatives-grid">${initiativesHTML}</div>
        </div>
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildRiskAssessmentHTML(content) {
  const risks = content.risks || [];
  
  const riskCells = { high: [], medium: [], low: [] };
  risks.forEach(risk => {
    const prob = (risk.probability || '').toLowerCase();
    if (prob.includes('high')) riskCells.high.push(risk);
    else if (prob.includes('medium') || prob.includes('med')) riskCells.medium.push(risk);
    else riskCells.low.push(risk);
  });
  
  const makeRiskItems = (items) => items.slice(0, 2).map(r => `
    <div class="risk-item">${r.name}</div>
  `).join('');
  
  const mitigations = content.mitigations || [];
  const mitigationRows = mitigations.map(m => `
    <tr>
      <td>${m.risk}</td>
      <td><span class="risk-badge ${m.level}">${m.level}</span></td>
      <td>${m.action}</td>
    </tr>
  `).join('');
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${content.title || 'Risk Assessment'}</h1>
      </div>
      <div class="slide-content">
        <div class="risk-container">
          <div class="risk-matrix">
            <div></div>
            <div class="risk-matrix-header">Low Impact</div>
            <div class="risk-matrix-header">Medium Impact</div>
            <div class="risk-matrix-header">High Impact</div>
            
            <div class="risk-matrix-label">High Probability</div>
            <div class="risk-cell medium"><div class="risk-cell-title">Medium Risk</div>${makeRiskItems(riskCells.high.filter(r => !r.impact?.includes('high')))}</div>
            <div class="risk-cell high"><div class="risk-cell-title">High Risk</div>${makeRiskItems(riskCells.high.filter(r => r.impact?.includes('medium')))}</div>
            <div class="risk-cell high"><div class="risk-cell-title">Critical</div>${makeRiskItems(riskCells.high.filter(r => r.impact?.includes('high')))}</div>
            
            <div class="risk-matrix-label">Medium Probability</div>
            <div class="risk-cell low"><div class="risk-cell-title">Low Risk</div>${makeRiskItems(riskCells.medium.filter(r => !r.impact))}</div>
            <div class="risk-cell medium"><div class="risk-cell-title">Medium Risk</div>${makeRiskItems(riskCells.medium.filter(r => r.impact))}</div>
            <div class="risk-cell high"><div class="risk-cell-title">High Risk</div>${makeRiskItems(riskCells.medium.filter(r => r.impact?.includes('high')))}</div>
            
            <div class="risk-matrix-label">Low Probability</div>
            <div class="risk-cell low"><div class="risk-cell-title">Minimal</div>${makeRiskItems(riskCells.low)}</div>
            <div class="risk-cell low"><div class="risk-cell-title">Low Risk</div></div>
            <div class="risk-cell medium"><div class="risk-cell-title">Monitor</div></div>
          </div>
          
          ${mitigations.length > 0 ? `
          <div style="margin-top: 20px;">
            <table class="mitigation-table">
              <thead><tr><th>Risk</th><th>Level</th><th>Mitigation</th></tr></thead>
              <tbody>${mitigationRows}</tbody>
            </table>
          </div>` : ''}
        </div>
      </div>
      ${buildFooter(content.footer)}
    </div>
  `;
}

function buildFooter(footer) {
  return `
    <div class="slide-footer">
      <div class="footer-left">
        ${footer?.source ? `<span>Source: ${footer.source}</span>` : ''}
        ${footer?.date ? `<span>${footer.date}</span>` : ''}
      </div>
      <span class="confidential">Confidential</span>
    </div>
  `;
}

function buildSlideHTML(slideType, content) {
  switch (slideType) {
    case 'Executive Summary':
      return buildExecutiveSummaryHTML(content);
    case 'Market Analysis':
      return buildMarketAnalysisHTML(content);
    case 'Financial Model':
      return buildFinancialModelHTML(content);
    case 'Competitive Analysis':
      return buildCompetitiveAnalysisHTML(content);
    case 'Growth Strategy':
      return buildGrowthStrategyHTML(content);
    case 'Risk Assessment':
      return buildRiskAssessmentHTML(content);
    default:
      return buildExecutiveSummaryHTML(content);
  }
}

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  templatesGrid: document.getElementById('templatesGrid'),
  recentlyUsedGrid: document.getElementById('recentlyUsedGrid'),
  recentlyUsedSection: document.getElementById('recentlyUsedSection'),
  templatesCount: document.getElementById('templatesCount'),
  typeFilter: document.getElementById('typeFilter'),
  audienceFilter: document.getElementById('audienceFilter'),
  useCaseFilter: document.getElementById('useCaseFilter'),
  resetFilters: document.getElementById('resetFilters'),
  showFavoritesBtn: document.getElementById('showFavoritesBtn'),
  clearRecent: document.getElementById('clearRecent'),
  backToAppBtn: document.getElementById('backToAppBtn'),
  previewModal: document.getElementById('previewModal'),
  modalClose: document.getElementById('modalClose'),
  previewTitle: document.getElementById('previewTitle'),
  previewSubtitle: document.getElementById('previewSubtitle'),
  previewFrame: document.getElementById('previewFrame'),
  previewType: document.getElementById('previewType'),
  previewAudience: document.getElementById('previewAudience'),
  previewFramework: document.getElementById('previewFramework'),
  starRating: document.getElementById('starRating'),
  ratingAverage: document.getElementById('ratingAverage'),
  favoriteBtn: document.getElementById('favoriteBtn'),
  favoriteText: document.getElementById('favoriteText'),
  useTemplateBtn: document.getElementById('useTemplateBtn'),
  toastContainer: document.getElementById('toastContainer')
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
  loadStoredData();
  state.templates = TEMPLATE_DATA;
  state.filteredTemplates = TEMPLATE_DATA;
  renderTemplates();
  renderRecentlyUsed();
  setupEventListeners();
  updateTemplatesCount();
}

function loadStoredData() {
  try {
    const favorites = localStorage.getItem('st_favorites');
    const recentlyUsed = localStorage.getItem('st_recently_used');
    const ratings = localStorage.getItem('st_ratings');
    
    if (favorites) state.favorites = JSON.parse(favorites);
    if (recentlyUsed) state.recentlyUsed = JSON.parse(recentlyUsed);
    if (ratings) state.ratings = JSON.parse(ratings);
  } catch (e) {
    console.error('Failed to load stored data:', e);
  }
}

function saveStoredData() {
  try {
    localStorage.setItem('st_favorites', JSON.stringify(state.favorites));
    localStorage.setItem('st_recently_used', JSON.stringify(state.recentlyUsed));
    localStorage.setItem('st_ratings', JSON.stringify(state.ratings));
  } catch (e) {
    console.error('Failed to save stored data:', e);
  }
}

// ============================================
// RENDERING
// ============================================

function renderTemplates() {
  if (!elements.templatesGrid) return;
  
  elements.templatesGrid.innerHTML = state.filteredTemplates.map(template => 
    createTemplateCard(template)
  ).join('');
  
  // Attach event listeners to cards
  elements.templatesGrid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.template-card__favorite') || e.target.closest('.btn')) return;
      openPreview(card.dataset.id);
    });
  });
  
  // Attach favorite button listeners
  elements.templatesGrid.querySelectorAll('.template-card__favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
    });
  });
  
  // Attach use template button listeners
  elements.templatesGrid.querySelectorAll('[data-action="use"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      useTemplate(btn.dataset.id);
    });
  });
}

function renderRecentlyUsed() {
  if (!elements.recentlyUsedGrid || !elements.recentlyUsedSection) return;
  
  if (state.recentlyUsed.length === 0) {
    elements.recentlyUsedSection.style.display = 'none';
    return;
  }
  
  elements.recentlyUsedSection.style.display = 'block';
  
  const recentTemplates = state.recentlyUsed
    .map(id => state.templates.find(t => t.id === id))
    .filter(Boolean);
  
  elements.recentlyUsedGrid.innerHTML = recentTemplates.map(template => 
    createTemplateCard(template, true)
  ).join('');
  
  // Attach event listeners
  elements.recentlyUsedGrid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.template-card__favorite') || e.target.closest('.btn')) return;
      openPreview(card.dataset.id);
    });
  });
  
  elements.recentlyUsedGrid.querySelectorAll('.template-card__favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.id);
    });
  });
  
  elements.recentlyUsedGrid.querySelectorAll('[data-action="use"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      useTemplate(btn.dataset.id);
    });
  });
}

function createTemplateCard(template, isCompact = false) {
  const isFavorite = state.favorites.includes(template.id);
  const slideHTML = buildSlideHTML(template.slideType, template.sampleData);
  
  return `
    <div class="template-card" data-id="${template.id}">
      <div class="template-card__preview">
        <button class="template-card__favorite ${isFavorite ? 'is-favorite' : ''}" 
                data-id="${template.id}"
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" 
               stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <div class="template-card__type-icon" title="${template.slideType}">${template.icon}</div>
        <div class="template-card__preview-inner">
          ${slideHTML}
        </div>
      </div>
      <div class="template-card__content">
        <h3 class="template-card__title">${template.name}</h3>
        <p class="template-card__description">${template.description}</p>
        <div class="template-card__meta">
          <span class="template-card__badge template-card__badge--type">${template.slideType}</span>
          <span class="template-card__badge template-card__badge--audience">${template.targetAudience}</span>
          <span class="template-card__badge">${template.useCase}</span>
        </div>
        <div class="template-card__rating">
          ${'★'.repeat(Math.floor(template.rating))}${'☆'.repeat(5 - Math.floor(template.rating))}
          <span class="template-card__rating-count">(${template.ratingCount})</span>
        </div>
        <div class="template-card__actions">
          <button class="btn btn--secondary btn--sm" data-action="use" data-id="${template.id}">
            Use Template
          </button>
        </div>
      </div>
    </div>
  `;
}

function updateTemplatesCount() {
  if (elements.templatesCount) {
    const count = state.filteredTemplates.length;
    elements.templatesCount.textContent = `${count} template${count !== 1 ? 's' : ''}`;
  }
}

// ============================================
// FILTERING
// ============================================

function applyFilters() {
  state.filteredTemplates = state.templates.filter(template => {
    const typeMatch = !state.filters.type || template.slideType === state.filters.type;
    const audienceMatch = !state.filters.audience || template.targetAudience === state.filters.audience;
    const useCaseMatch = !state.filters.useCase || template.useCase === state.filters.useCase;
    
    return typeMatch && audienceMatch && useCaseMatch;
  });
  
  if (state.showingFavorites) {
    state.filteredTemplates = state.filteredTemplates.filter(t => 
      state.favorites.includes(t.id)
    );
  }
  
  renderTemplates();
  updateTemplatesCount();
}

function resetFilters() {
  state.filters = { type: '', audience: '', useCase: '' };
  state.showingFavorites = false;
  
  elements.typeFilter.value = '';
  elements.audienceFilter.value = '';
  elements.useCaseFilter.value = '';
  
  applyFilters();
}

// ============================================
// PREVIEW MODAL
// ============================================

function openPreview(templateId) {
  const template = state.templates.find(t => t.id === templateId);
  if (!template) return;
  
  state.currentTemplate = template;
  
  // Update modal content
  elements.previewTitle.textContent = template.name;
  elements.previewSubtitle.textContent = template.description;
  elements.previewType.textContent = template.slideType;
  elements.previewAudience.textContent = template.targetAudience;
  elements.previewFramework.textContent = template.framework;
  
  // Render preview
  const slideHTML = buildSlideHTML(template.slideType, template.sampleData);
  elements.previewFrame.innerHTML = `
    <style>${SLIDE_STYLES}</style>
    ${slideHTML}
  `;
  
  // Update favorite button
  updateFavoriteButton();
  
  // Update star rating
  updateStarRating();
  
  // Show modal
  elements.previewModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  elements.previewModal.classList.remove('open');
  document.body.style.overflow = '';
  state.currentTemplate = null;
}

function updateFavoriteButton() {
  if (!state.currentTemplate) return;
  
  const isFavorite = state.favorites.includes(state.currentTemplate.id);
  elements.favoriteText.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
  
  const svg = elements.favoriteBtn.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', isFavorite ? 'currentColor' : 'none');
  }
}

function updateStarRating() {
  if (!state.currentTemplate) return;
  
  const userRating = state.ratings[state.currentTemplate.id] || 0;
  const average = state.currentTemplate.rating;
  
  elements.starRating.querySelectorAll('.star').forEach((star, i) => {
    star.classList.toggle('is-selected', i < userRating);
    star.classList.toggle('is-active', i < Math.floor(average));
  });
  
  elements.ratingAverage.textContent = `${average} / 5 (${state.currentTemplate.ratingCount} ratings)`;
}

// ============================================
// ACTIONS
// ============================================

function toggleFavorite(templateId) {
  const index = state.favorites.indexOf(templateId);
  
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast('Removed from favorites', 'info');
  } else {
    state.favorites.push(templateId);
    showToast('Added to favorites', 'success');
  }
  
  saveStoredData();
  renderTemplates();
  renderRecentlyUsed();
  
  if (state.currentTemplate && state.currentTemplate.id === templateId) {
    updateFavoriteButton();
  }
}

function rateTemplate(rating) {
  if (!state.currentTemplate) return;
  
  state.ratings[state.currentTemplate.id] = rating;
  saveStoredData();
  updateStarRating();
  showToast(`Rated ${rating} stars`, 'success');
}

function useTemplate(templateId) {
  const template = state.templates.find(t => t.id === templateId);
  if (!template) return;
  
  // Add to recently used
  const index = state.recentlyUsed.indexOf(templateId);
  if (index > -1) {
    state.recentlyUsed.splice(index, 1);
  }
  state.recentlyUsed.unshift(templateId);
  if (state.recentlyUsed.length > 6) {
    state.recentlyUsed.pop();
  }
  saveStoredData();
  renderRecentlyUsed();
  
  // Redirect to app with template data
  const params = new URLSearchParams({
    template: templateId,
    type: template.slideType,
    audience: template.targetAudience
  });
  
  showToast('Opening template...', 'success');
  
  setTimeout(() => {
    window.location.href = `index.html?${params.toString()}`;
  }, 500);
}

function clearRecentlyUsed() {
  state.recentlyUsed = [];
  saveStoredData();
  renderRecentlyUsed();
  showToast('Recently used cleared', 'info');
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Filters
  elements.typeFilter?.addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    applyFilters();
  });
  
  elements.audienceFilter?.addEventListener('change', (e) => {
    state.filters.audience = e.target.value;
    applyFilters();
  });
  
  elements.useCaseFilter?.addEventListener('change', (e) => {
    state.filters.useCase = e.target.value;
    applyFilters();
  });
  
  // Reset filters
  elements.resetFilters?.addEventListener('click', resetFilters);
  
  // Show favorites
  elements.showFavoritesBtn?.addEventListener('click', () => {
    state.showingFavorites = !state.showingFavorites;
    elements.showFavoritesBtn.classList.toggle('active', state.showingFavorites);
    applyFilters();
    
    if (state.showingFavorites) {
      showToast('Showing favorites only', 'info');
    }
  });
  
  // Clear recently used
  elements.clearRecent?.addEventListener('click', clearRecentlyUsed);
  
  // Back to app
  elements.backToAppBtn?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  // Modal close
  elements.modalClose?.addEventListener('click', closePreview);
  elements.previewModal?.querySelector('.modal-backdrop')?.addEventListener('click', closePreview);
  
  // Favorite button in modal
  elements.favoriteBtn?.addEventListener('click', () => {
    if (state.currentTemplate) {
      toggleFavorite(state.currentTemplate.id);
    }
  });
  
  // Use template button in modal
  elements.useTemplateBtn?.addEventListener('click', () => {
    if (state.currentTemplate) {
      useTemplate(state.currentTemplate.id);
    }
  });
  
  // Star rating
  elements.starRating?.querySelectorAll('.star').forEach((star, i) => {
    star.addEventListener('click', () => rateTemplate(i + 1));
    
    star.addEventListener('mouseenter', () => {
      elements.starRating.querySelectorAll('.star').forEach((s, j) => {
        s.classList.toggle('is-active', j <= i);
      });
    });
  });
  
  elements.starRating?.addEventListener('mouseleave', () => {
    updateStarRating();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.previewModal?.classList.contains('open')) {
      closePreview();
    }
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  
  elements.toastContainer?.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', init);
