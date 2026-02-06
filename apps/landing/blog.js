/**
 * SlideTheory Blog - JavaScript
 * Blog-specific functionality: article modals, category filtering, mobile menu
 */

// Article content data
const articlesData = {
  'action-titles': {
    category: 'writing',
    categoryLabel: 'Slide Writing',
    title: 'How to Write Slide Titles That Get Executive Attention',
    date: 'Feb 5, 2026',
    readTime: '8 min read',
    content: `
      <p>The difference between a good presentation and a great one often comes down to slide titles. In consulting, we call these "action titles"—and they're the single most important element of any slide.</p>

      <h2>What is an Action Title?</h2>
      <p>An action title communicates the main message or "so what" of a slide, not just its topic. It transforms passive viewing into active understanding.</p>

      <p><strong>Weak title:</strong> "Revenue by Region"<br>
      <strong>Strong title:</strong> "West region drives 60% of revenue growth, presenting expansion opportunity"</p>

      <p>See the difference? The weak title tells you what the slide is about. The strong title tells you why it matters and what to do about it.</p>

      <h2>The Formula for Great Action Titles</h2>
      <p>A great action title typically includes three elements:</p>

      <ol>
        <li><strong>The Finding:</strong> What did you discover? (e.g., "West region drives 60% of growth")</li>
        <li><strong>The Implication:</strong> Why does it matter? (e.g., "presenting expansion opportunity")</li>
        <li><strong>The Direction:</strong> What should we do? (often implicit)</li>
      </ol>

      <h2>More Examples: Weak vs. Strong</h2>

      <p><strong>Market Analysis Slide</strong><br>
      ❌ Weak: "Market Size"<br>
      ✅ Strong: "$50B addressable market with 15% CAGR offers $2B revenue potential by 2028"</p>

      <p><strong>Competitive Analysis Slide</strong><br>
      ❌ Weak: "Competitor Comparison"<br>
      ✅ Strong: "Competitor X's premium positioning creates gap for mid-market solution"</p>

      <p><strong>Financial Performance Slide</strong><br>
      ❌ Weak: "Q3 Results"<br>
      ✅ Strong: "Q3 EBITDA up 23% driven by cost reduction; on track for full-year target"</p>

      <div class="article-tip">
        <div class="article-tip-title">💡 Pro Tip</div>
        <p>Write your action title first, then build the slide to support it. This ensures your slide has a clear point, not just data.</p>
      </div>

      <h2>Common Patterns in Consulting</h2>

      <p>After reviewing thousands of slides from McKinsey, BCG, and Bain, we've identified these recurring patterns:</p>

      <ul>
        <li><strong>"[Finding] driven by [Driver], presenting [Opportunity/Risk]"</strong></li>
        <li><strong>"[Metric] up/down [X]% due to [Reason]; [Implication]"</strong></li>
        <li><strong>"[Current State] creates [Gap/Opportunity] for [Action]"</strong></li>
        <li><strong>"[Comparison] shows [Insight], suggesting [Recommendation]"</strong></li>
      </ul>

      <h2>Practice Exercise</h2>

      <p>Try improving these weak titles:</p>

      <ol>
        <li>"Customer Survey Results"</li>
        <li>"Product Roadmap"</li>
        <li>"Team Structure"</li>
      </ol>

      <p>(Answers in the comments—share your improvements!)</p>

      <h2>The Title Quality Checklist</h2>

      <p>Before finalizing any slide, ask yourself:</p>

      <ul>
        <li>✅ Does it communicate a clear point of view?</li>
        <li>✅ Could someone understand the slide's message without reading the body?</li>
        <li>✅ Does it answer "so what?" or "why does this matter?"</li>
        <li>✅ Is it specific (numbers, percentages) rather than vague?</li>
        <li>✅ Is it concise (ideally under 15 words)?</li>
      </ul>

      <h2>Putting It Into Practice</h2>

      <p>Action titles aren't just a writing technique—they're a thinking technique. They force you to have a point of view. They ensure every slide contributes to your overall argument.</p>

      <p>Start applying this framework to your next presentation. Write the titles first. Make them specific, insightful, and action-oriented. Your audience will thank you.</p>
    `
  },
  minto: {
    category: 'writing',
    categoryLabel: 'Slide Writing',
    title: 'The Pyramid Principle: Barbara Minto\'s Framework for Clear Communication',
    date: 'Feb 3, 2026',
    readTime: '12 min read',
    content: `
      <p>Barbara Minto literally wrote the book on structured communication in consulting. Developed at McKinsey in the 1970s, the Pyramid Principle remains the gold standard for presenting ideas clearly and persuasively.</p>

      <h2>The Core Concept: Start With the Answer</h2>

      <p>Most people present ideas the way they discovered them: chronologically. They walk the audience through their journey of discovery, building to a conclusion at the end.</p>

      <p>The Pyramid Principle flips this. <strong>Start with your main recommendation or conclusion.</strong> Then support it with grouped arguments. Then support those with evidence.</p>

      <h2>The Pyramid Structure</h2>

      <p><strong>Top (Governing Thought):</strong> Your main recommendation or answer<br>
      <strong>Middle (Key Line Points):</strong> 3-5 arguments that directly support the governing thought<br>
      <strong>Base (Evidence):</strong> Data, analysis, and facts that support each key line point</p>

      <h2>Vertical Logic: Why?</h2>

      <p>Moving down the pyramid answers "Why?" or "How?" questions:</p>

      <blockquote>
        "We should enter the European market [GOVERNING THOUGHT]<br>
        ↓ Why?<br>
        Because the market is large, growing, and we have a competitive advantage [KEY LINE]<br>
        ↓ Why is it large?<br>
        €50B TAM with 12% CAGR... [EVIDENCE]"
      </blockquote>

      <h2>Horizontal Logic: Grouping</h2>

      <p>At each level, ideas should be grouped logically using either:</p>

      <ul>
        <li><strong>Deductive reasoning:</strong> Major premise → minor premise → conclusion</li>
        <li><strong>Inductive reasoning:</strong> Group similar ideas that support a common point (MECE)</li>
      </ul>

      <div class="article-tip">
        <div class="article-tip-title">💡 Pro Tip</div>
        <p>In consulting, inductive reasoning is preferred. It's easier for busy executives to absorb. Save deductive reasoning for when you need to prove something controversial.</p>
      </div>

      <h2>SCQA: The Introduction</h2>

      <p>Before diving into the pyramid, set context using SCQA:</p>

      <ul>
        <li><strong>Situation:</strong> What the audience already knows and agrees with</li>
        <li><strong>Complication:</strong> What's changed that requires action?</li>
        <li><strong>Question:</strong> The implicit question raised by the complication</li>
        <li><strong>Answer:</strong> Your governing thought (top of the pyramid)</li>
      </ul>

      <h2>Real-World Example</h2>

      <p><strong>Situation:</strong> Our company has grown 20% annually for the past 5 years.</p>

      <p><strong>Complication:</strong> However, customer acquisition costs have doubled, threatening profitability.</p>

      <p><strong>Question:</strong> How can we maintain growth while restoring margins?</p>

      <p><strong>Answer:</strong> We should shift from acquisition-focused growth to retention and expansion.</p>

      <h3>Supporting Arguments:</h3>
      <ol>
        <li>Retention costs 5x less than acquisition</li>
        <li>Existing customers have 3x higher LTV</li>
        <li>Our NPS scores indicate expansion readiness</li>
      </ol>

      <h2>Why It Works</h2>

      <p>The Pyramid Principle works because it:</p>

      <ul>
        <li>Respects your audience's time (main point first)</li>
        <li>Makes your logic transparent and testable</li>
        <li>Forces you to organize your thinking</li>
        <li>Makes content skimmable</li>
      </ul>

      <h2>Common Mistakes</h2>

      <ul>
        <li>❌ Burying the lead (saving the recommendation for the end)</li>
        <li>❌ Multiple governing thoughts (trying to say everything at once)</li>
        <li>❌ Logical gaps (missing steps between levels)</li>
        <li>❌ Overwhelming detail (too many supporting points)</li>
      </ul>

      <h2>Getting Started</h2>

      <p>For your next presentation:</p>

      <ol>
        <li>Write your governing thought in one sentence</li>
        <li>Identify 3-5 key supporting arguments (MECE)</li>
        <li>Gather evidence for each argument</li>
        <li>Write an SCQA introduction</li>
        <li>Review: Does every element support the governing thought?</li>
      </ol>

      <p>The Pyramid Principle takes practice, but it's transformative. Master it, and your communication will stand out in any room.</p>
    `
  },
  mece: {
    category: 'framework',
    categoryLabel: 'Frameworks',
    title: 'MECE: The Secret to Structured Thinking',
    date: 'Jan 12, 2026',
    readTime: '8 min read',
    content: `
      <p>Two words separate amateur analysis from professional consulting: <strong>Mutually Exclusive, Collectively Exhaustive</strong>—MECE for short.</p>

      <h2>What Does MECE Mean?</h2>

      <p><strong>Mutually Exclusive:</strong> Categories don't overlap. Each item fits in only one bucket.</p>

      <p><strong>Collectively Exhaustive:</strong> All possibilities are covered. Nothing is missed.</p>

      <p>Think of a complete, organized filing system where every document has exactly one place—and every document has a place.</p>

      <h2>Why MECE Matters</h2>

      <p>MECE thinking eliminates two common analytical errors:</p>

      <ul>
        <li><strong>Double-counting:</strong> When categories overlap, you count the same thing twice (e.g., revenue from "enterprise" customers who are also "new")</li>
        <li><strong>Gaps:</strong> When categories don't cover everything, you miss important areas (e.g., analyzing revenue by geography but forgetting online sales)</li>
      </ul>

      <h2>Common MECE Frameworks</h2>

      <h3>1. The 2x2 Matrix</h3>
      <p>High/Low on two dimensions creates four mutually exclusive, collectively exhaustive segments.</p>

      <h3>2. Process Steps</h3>
      <p>Sequential steps in a workflow: Step 1 → Step 2 → Step 3. Each item is in one step, all steps cover the process.</p>

      <h3>3. Customer Segments</h3>
      <p>By company size: Small, Medium, Large, Enterprise. Or by industry verticals that don't overlap.</p>

      <h3>4. Time Periods</h3>
      <p>Q1, Q2, Q3, Q4. Or Years 1-3 of a plan. Time is naturally MECE.</p>

      <h3>5. Geographic Breakdown</h3>
      <p>North America, EMEA, APAC, LATAM. Countries don't overlap, together they cover the world.</p>

      <div class="article-tip">
        <div class="article-tip-title">💡 Pro Tip</div>
        <p>When struggling to make something MECE, try these approaches: Process, Structure (org chart), Matrix (2x2), or Algebraic formula.</p>
      </div>

      <h2>Real Example: Revenue Analysis</h2>

      <p>❌ <strong>Non-MECE:</strong> Segment by "Enterprise customers" and "New customers"<br>
      (Overlap: Enterprise customers can be new)</p>

      <p>✅ <strong>MECE:</strong> Segment by "Enterprise / SMB" AND "New / Existing"<br>
      (Four segments: New Enterprise, Existing Enterprise, New SMB, Existing SMB)</p>

      <h2>The MECE Test</h2>

      <p>Before finalizing any categorization, ask:</p>

      <ul>
        <li>🧩 <strong>Mutually Exclusive?</strong> Can any item fit in more than one category?</li>
        <li>📋 <strong>Collectively Exhaustive?</strong> Are there any items that don't fit anywhere?</li>
      </ul>

      <h2>MECE in Practice</h2>

      <p>MECE isn't just for formal presentations. Use it for:</p>

      <ul>
        <li>To-do lists (grouping tasks)</li>
        <li>Meeting agendas (structuring discussion)</li>
        <li>Research plans (ensuring comprehensive coverage)</li>
        <li>Problem-solving (breaking down complex issues)</li>
      </ul>

      <h2>Beyond Perfect MECE</h2>

      <p>Sometimes perfect MECE is impossible or impractical. In these cases:</p>

      <ul>
        <li>Use an "Other" category (acknowledge the gap)</li>
        <li>Prioritize the 80/20 (focus on what matters most)</li>
        <li>Document your logic (show you thought about the boundaries)</li>
      </ul>

      <p>The goal isn't perfection—it's clarity. MECE thinking forces you to be explicit about categories, boundaries, and coverage. That clarity alone is worth the effort.</p>
    `
  }
};

// DOM elements
const categoryPills = document.querySelectorAll('.category-pill');
const blogCards = document.querySelectorAll('.blog-card');
const articleModal = document.getElementById('articleModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = articleModal.querySelector('.modal-backdrop');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

/**
 * Initialize blog functionality
 */
function initBlog() {
  setupCategoryFiltering();
  setupArticleModal();
  setupMobileMenu();
}

/**
 * Category filtering functionality
 */
function setupCategoryFiltering() {
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.dataset.category;
      
      // Update active pill
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      blogCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Article modal functionality
 */
function setupArticleModal() {
  // Blog card clicks
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.dataset.id;
      openArticle(articleId);
    });
  });

  // Read more links
  document.querySelectorAll('.read-more-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = link.dataset.article;
      openArticle(articleId);
    });
  });

  // Close modal handlers
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !articleModal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * Open article modal with content
 */
function openArticle(articleId) {
  const data = articlesData[articleId];
  if (!data) return;

  document.getElementById('modalCategory').textContent = data.categoryLabel;
  document.getElementById('modalCategory').className = `article-modal-category ${data.category}`;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDate').textContent = `📅 ${data.date}`;
  document.getElementById('modalReadTime').textContent = `⏱️ ${data.readTime}`;
  document.getElementById('modalContent').innerHTML = data.content;

  articleModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Focus management for accessibility
  modalClose.focus();
}

/**
 * Close article modal
 */
function closeModal() {
  articleModal.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Mobile menu functionality
 */
function setupMobileMenu() {
  if (!mobileMenuToggle || !navLinks) return;
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initBlog);
