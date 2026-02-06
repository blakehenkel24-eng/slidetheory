/**
 * SlideTheory Onboarding System
 * Handles wizard, tooltips, progress tracking, badges, and help widget
 */

// ============================================
// ONBOARDING STATE
// ============================================

const OnboardingState = {
  STORAGE_KEY: 'slidetheory_onboarding',
  
  getDefault() {
    return {
      completed: false,
      currentStep: 0,
      skipped: false,
      tasksCompleted: {
        firstVisit: false,
        createdFirstSlide: false,
        exportedSlide: false,
        usedTemplate: false,
        exploredFeatures: false,
        sharedSlide: false
      },
      badgesEarned: [],
      lastActive: Date.now()
    };
  },
  
  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefault();
    } catch (e) {
      return this.getDefault();
    }
  },
  
  save(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        ...state,
        lastActive: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save onboarding state:', e);
    }
  },
  
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// ============================================
// BADGES SYSTEM
// ============================================

const Badges = {
  definitions: [
    {
      id: 'first_slide',
      name: 'First Steps',
      description: 'Created your first slide',
      icon: '🎉',
      color: '#fef3c7'
    },
    {
      id: 'first_export',
      name: 'Exporter',
      description: 'Downloaded your first slide',
      icon: '📥',
      color: '#dbeafe'
    },
    {
      id: 'template_master',
      name: 'Template Master',
      description: 'Used 3 different slide types',
      icon: '🎨',
      color: '#f3e8ff'
    },
    {
      id: 'power_user',
      name: 'Power User',
      description: 'Used keyboard shortcuts',
      icon: '⚡',
      color: '#fef9c3'
    },
    {
      id: 'sharer',
      name: 'Team Player',
      description: 'Shared a slide with others',
      icon: '🤝',
      color: '#dcfce7'
    },
    {
      id: 'data_wizard',
      name: 'Data Wizard',
      description: 'Uploaded data file',
      icon: '📊',
      color: '#fce7f3'
    },
    {
      id: 'ten_slides',
      name: 'Slide Pro',
      description: 'Created 10 slides',
      icon: '🏆',
      color: '#ffedd5'
    },
    {
      id: 'onboarding_complete',
      name: 'Onboarding Graduate',
      description: 'Completed the onboarding',
      icon: '🎓',
      color: '#d1fae5'
    }
  ],
  
  show(badgeId) {
    const badge = this.definitions.find(b => b.id === badgeId);
    if (!badge) return;
    
    const state = OnboardingState.load();
    if (state.badgesEarned.includes(badgeId)) return;
    
    // Add to earned badges
    state.badgesEarned.push(badgeId);
    OnboardingState.save(state);
    
    // Show notification
    this.showNotification(badge);
  },
  
  showNotification(badge) {
    // Remove existing notification
    const existing = document.querySelector('.badge-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
      <button class="badge-notification-close" onclick="this.parentElement.remove()">×</button>
      <div class="badge-notification-icon">${badge.icon}</div>
      <div class="badge-notification-content">
        <h4>Badge Unlocked!</h4>
        <h3>${badge.name}</h3>
        <p>${badge.description}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  },
  
  hasBadge(badgeId) {
    const state = OnboardingState.load();
    return state.badgesEarned.includes(badgeId);
  },
  
  renderCollection(container) {
    const state = OnboardingState.load();
    
    container.innerHTML = `
      <div class="badge-collection">
        ${this.definitions.map(badge => {
          const earned = state.badgesEarned.includes(badge.id);
          return `
            <div class="badge-item ${earned ? '' : 'locked'}">
              <div class="badge-item-icon">${earned ? badge.icon : '🔒'}</div>
              <h4>${badge.name}</h4>
              <p>${badge.description}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

// ============================================
// ONBOARDING WIZARD
// ============================================

const OnboardingWizard = {
  steps: [
    {
      title: 'Welcome to SlideTheory!',
      content: `
        <div class="wizard-illustration">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#dbeafe"/>
            <rect x="25" y="35" width="50" height="35" rx="4" fill="white" stroke="#1e3a5f" stroke-width="2"/>
            <line x1="32" y1="48" x2="68" y2="48" stroke="#2563eb" stroke-width="2"/>
            <line x1="32" y1="56" x2="58" y2="56" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="72" cy="32" r="10" fill="#10b981"/>
            <path d="M68 32L71 35L76 29" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p style="text-align: center;">Create professional MBB-style slides in seconds with AI. Let's get you set up in 3 quick steps.</p>
      `,
      options: []
    },
    {
      title: 'What brings you here?',
      content: '<p>Select your primary use case so we can personalize your experience:</p>',
      options: [
        { id: 'consultant', icon: '💼', title: 'Management Consultant', desc: 'McKinsey, BCG, Bain style decks' },
        { id: 'startup', icon: '🚀', title: 'Startup Founder', desc: 'Investor pitches, board updates' },
        { id: 'corporate', icon: '🏢', title: 'Corporate Strategy', desc: 'Internal presentations, planning' },
        { id: 'freelance', icon: '👤', title: 'Freelancer', desc: 'Client proposals, reports' }
      ]
    },
    {
      title: 'What type of slides do you need most?',
      content: '<p>You can create all types, but we\'ll prioritize your preference:</p>',
      options: [
        { id: 'executive', icon: '📊', title: 'Executive Summaries', desc: 'High-level insights for leadership' },
        { id: 'process', icon: '→', title: 'Process Flows', desc: 'Workflows, timelines, steps' },
        { id: 'data', icon: '📈', title: 'Data Visualizations', desc: 'Charts, graphs, analysis' },
        { id: 'mixed', icon: '🎨', title: 'A mix of everything', desc: 'Various slide types' }
      ]
    }
  ],
  
  currentStep: 0,
  selections: {},
  overlay: null,
  
  init() {
    const state = OnboardingState.load();
    if (state.completed || state.skipped) return;
    
    // Show wizard after a short delay
    setTimeout(() => this.show(), 1000);
  },
  
  show() {
    this.createOverlay();
    this.renderStep();
    
    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
    });
  },
  
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'onboarding-overlay';
    this.overlay.innerHTML = `
      <div class="onboarding-wizard">
        <div class="wizard-header">
          <h2>Slide<span style="color: #60a5fa;">Theory</span></h2>
          <div class="wizard-progress">
            ${this.steps.map((_, i) => `
              <div class="wizard-progress-dot ${i === 0 ? 'active' : ''}" data-step="${i}"></div>
            `).join('')}
          </div>
        </div>
        <div class="wizard-content"></div>
        <div class="wizard-footer">
          <button class="wizard-btn wizard-btn-secondary" id="wizardBack" style="visibility: hidden;">Back</button>
          <span class="wizard-skip" onclick="OnboardingWizard.skip()">Skip tour</span>
          <button class="wizard-btn wizard-btn-primary" id="wizardNext">Get Started</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Event listeners
    this.overlay.querySelector('#wizardNext').addEventListener('click', () => this.next());
    this.overlay.querySelector('#wizardBack').addEventListener('click', () => this.back());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.skip();
    });
  },
  
  renderStep() {
    const step = this.steps[this.currentStep];
    const contentEl = this.overlay.querySelector('.wizard-content');
    const backBtn = this.overlay.querySelector('#wizardBack');
    const nextBtn = this.overlay.querySelector('#wizardNext');
    
    // Update progress dots
    this.overlay.querySelectorAll('.wizard-progress-dot').forEach((dot, i) => {
      dot.className = 'wizard-progress-dot';
      if (i < this.currentStep) dot.classList.add('completed');
      if (i === this.currentStep) dot.classList.add('active');
    });
    
    // Update buttons
    backBtn.style.visibility = this.currentStep > 0 ? 'visible' : 'hidden';
    nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Start Creating' : 'Next';
    
    // Render content
    let html = `
      <div class="wizard-step active">
        <h3>${step.title}</h3>
        ${step.content}
    `;
    
    if (step.options.length > 0) {
      html += `<div class="wizard-options">`;
      step.options.forEach(opt => {
        const selected = this.selections[this.currentStep] === opt.id ? 'selected' : '';
        html += `
          <div class="wizard-option ${selected}" data-option="${opt.id}" onclick="OnboardingWizard.selectOption('${opt.id}')">
            <div class="wizard-option-icon">${opt.icon}</div>
            <div class="wizard-option-text">
              <h4>${opt.title}</h4>
              <p>${opt.desc}</p>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }
    
    html += `</div>`;
    contentEl.innerHTML = html;
    
    // Update next button state
    if (step.options.length > 0) {
      nextBtn.disabled = !this.selections[this.currentStep];
    } else {
      nextBtn.disabled = false;
    }
  },
  
  selectOption(optionId) {
    this.selections[this.currentStep] = optionId;
    
    // Update visual selection
    this.overlay.querySelectorAll('.wizard-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.option === optionId);
    });
    
    // Enable next button
    this.overlay.querySelector('#wizardNext').disabled = false;
  },
  
  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.complete();
    }
  },
  
  back() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep();
    }
  },
  
  skip() {
    const state = OnboardingState.load();
    state.skipped = true;
    OnboardingState.save(state);
    
    this.close();
    
    // Show progress indicator instead
    setTimeout(() => OnboardingProgress.show(), 500);
  },
  
  complete() {
    const state = OnboardingState.load();
    state.completed = true;
    state.tasksCompleted.firstVisit = true;
    OnboardingState.save(state);
    
    // Award onboarding badge
    Badges.show('onboarding_complete');
    
    this.close();
    
    // Start tutorial
    setTimeout(() => Tutorial.start(), 500);
  },
  
  close() {
    this.overlay.classList.remove('active');
    setTimeout(() => {
      this.overlay.remove();
      this.overlay = null;
    }, 300);
  }
};

// ============================================
// TUTORIAL TOOLTIPS
// ============================================

const Tutorial = {
  steps: [
    {
      target: '#slideTypeV2',
      title: '🎨 Choose Your Slide Type',
      content: 'Start by selecting the type of slide you need. Executive Summary is perfect for board presentations.',
      position: 'right'
    },
    {
      target: '#keyTakeawayV2',
      title: '💡 The Key Takeaway',
      content: 'This is the most important field. What's the one thing you want your audience to remember?',
      position: 'right'
    },
    {
      target: '#contextV2',
      title: '📝 Add Context',
      content: 'Provide background information, data, and strategic context. The more details, the better the AI can help.',
      position: 'right'
    },
    {
      target: '#generateBtnV2',
      title: '⚡ Generate Your Slide',
      content: 'Click here or press Ctrl+Enter to create your professional slide in seconds!',
      position: 'top'
    }
  ],
  
  currentStep: 0,
  spotlight: null,
  tooltip: null,
  
  start() {
    this.currentStep = 0;
    this.showStep();
  },
  
  showStep() {
    const step = this.steps[this.currentStep];
    const target = document.querySelector(step.target);
    
    if (!target) {
      this.end();
      return;
    }
    
    this.createSpotlight(target);
    this.createTooltip(target, step);
  },
  
  createSpotlight(target) {
    // Remove existing
    if (this.spotlight) this.spotlight.remove();
    
    const rect = target.getBoundingClientRect();
    this.spotlight = document.createElement('div');
    this.spotlight.className = 'tutorial-spotlight';
    this.spotlight.style.cssText = `
      top: ${rect.top - 4}px;
      left: ${rect.left - 4}px;
      width: ${rect.width + 8}px;
      height: ${rect.height + 8}px;
    `;
    
    document.body.appendChild(this.spotlight);
  },
  
  createTooltip(target, step) {
    // Remove existing
    if (this.tooltip) this.tooltip.remove();
    
    const rect = target.getBoundingClientRect();
    this.tooltip = document.createElement('div');
    this.tooltip.className = `tutorial-tooltip ${step.position}`;
    this.tooltip.innerHTML = `
      <h4>${step.title}</h4>
      <p>${step.content}</p>
      <div class="tutorial-tooltip-actions">
        <span class="tutorial-tooltip-step">${this.currentStep + 1} of ${this.steps.length}</span>
        <button class="tutorial-tooltip-btn" onclick="Tutorial.next()">
          ${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    `;
    
    document.body.appendChild(this.tooltip);
    
    // Position tooltip
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let top, left;
    
    switch(step.position) {
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 15;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 15;
        break;
      case 'bottom':
        top = rect.bottom + 15;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'top':
        top = rect.top - tooltipRect.height - 15;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
    }
    
    // Keep in viewport
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    
    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  },
  
  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    } else {
      this.end();
    }
  },
  
  end() {
    if (this.spotlight) {
      this.spotlight.remove();
      this.spotlight = null;
    }
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
    
    // Show progress indicator
    OnboardingProgress.show();
  }
};

// ============================================
// PROGRESS INDICATOR
// ============================================

const OnboardingProgress = {
  tasks: [
    { id: 'firstVisit', label: 'Complete onboarding', action: null },
    { id: 'createdFirstSlide', label: 'Create your first slide', action: () => document.querySelector('#keyTakeawayV2')?.focus() },
    { id: 'exportedSlide', label: 'Export a slide', action: null },
    { id: 'usedTemplate', label: 'Try a template', action: null },
    { id: 'exploredFeatures', label: 'Explore all features', action: () => document.querySelector('#helpBtn')?.click() }
  ],
  
  panel: null,
  
  show() {
    if (this.panel) return;
    
    const state = OnboardingState.load();
    if (state.completed && Object.values(state.tasksCompleted).every(Boolean)) return;
    
    this.createPanel();
  },
  
  createPanel() {
    const state = OnboardingState.load();
    const completedCount = Object.values(state.tasksCompleted).filter(Boolean).length;
    const totalCount = this.tasks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    this.panel = document.createElement('div');
    this.panel.className = 'onboarding-progress';
    this.panel.innerHTML = `
      <div class="onboarding-progress-header">
        <h4>Getting Started</h4>
        <button class="onboarding-progress-close" onclick="OnboardingProgress.hide()">×</button>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="progress-percentage">${percentage}% complete</div>
      <ul class="progress-tasks">
        ${this.tasks.map(task => {
          const completed = state.tasksCompleted[task.id];
          return `
            <li class="progress-task ${completed ? 'completed' : ''}" onclick="OnboardingProgress.handleTaskClick('${task.id}')">
              <span class="progress-task-icon">${completed ? '✓' : ''}</span>
              <span>${task.label}</span>
              ${!completed && task.action ? '<span class="progress-task-cta">Go →</span>' : ''}
            </li>
          `;
        }).join('')}
      </ul>
    `;
    
    document.body.appendChild(this.panel);
  },
  
  hide() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  },
  
  handleTaskClick(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.action) {
      task.action();
    }
  },
  
  update() {
    if (!this.panel) return;
    
    const state = OnboardingState.load();
    const completedCount = Object.values(state.tasksCompleted).filter(Boolean).length;
    const totalCount = this.tasks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    const fill = this.panel.querySelector('.progress-bar-fill');
    const percentageText = this.panel.querySelector('.progress-percentage');
    
    if (fill) fill.style.width = `${percentage}%`;
    if (percentageText) percentageText.textContent = `${percentage}% complete`;
    
    // Update task states
    this.panel.querySelectorAll('.progress-task').forEach((el, i) => {
      const task = this.tasks[i];
      const completed = state.tasksCompleted[task.id];
      el.classList.toggle('completed', completed);
      el.querySelector('.progress-task-icon').textContent = completed ? '✓' : '';
    });
  },
  
  completeTask(taskId) {
    const state = OnboardingState.load();
    if (!state.tasksCompleted[taskId]) {
      state.tasksCompleted[taskId] = true;
      OnboardingState.save(state);
      this.update();
      
      // Check if all tasks complete
      if (Object.values(state.tasksCompleted).every(Boolean)) {
        setTimeout(() => {
          this.hide();
          Badges.show('onboarding_complete');
        }, 1000);
      }
    }
  }
};

// ============================================
// HELP WIDGET
// ============================================

const HelpWidget = {
  knowledgeBase: [
    { title: 'Getting Started Guide', desc: 'Learn the basics of SlideTheory', icon: '📖', url: '/help/getting-started' },
    { title: 'Slide Types Explained', desc: 'Understand different slide formats', icon: '📊', url: '/help/slide-types' },
    { title: 'Keyboard Shortcuts', desc: 'Speed up your workflow', icon: '⌨️', url: '/help/shortcuts' },
    { title: 'Data Import Guide', desc: 'Upload CSV and Excel files', icon: '📁', url: '/help/data-import' },
    { title: 'Export Options', desc: 'PNG, PDF, and PowerPoint', icon: '📥', url: '/help/export' },
    { title: 'Sharing Slides', desc: 'Collaborate with your team', icon: '🔗', url: '/help/sharing' }
  ],
  
  shortcuts: [
    { title: 'Generate Slide', shortcut: 'Ctrl + Enter' },
    { title: 'Regenerate', shortcut: 'Ctrl + R' },
    { title: 'Download', shortcut: 'Ctrl + D' },
    { title: 'Share', shortcut: 'Ctrl + S' },
    { title: 'Show Help', shortcut: '?' }
  ],
  
  panel: null,
  button: null,
  isOpen: false,
  
  init() {
    this.createButton();
  },
  
  createButton() {
    this.button = document.createElement('button');
    this.button.className = 'help-widget-button';
    this.button.innerHTML = '?';
    this.button.title = 'Help (Press ?)';
    this.button.addEventListener('click', () => this.toggle());
    
    document.body.appendChild(this.button);
  },
  
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'help-widget-panel';
    this.panel.innerHTML = `
      <div class="help-widget-header">
        <h3>How can we help?</h3>
        <div class="help-widget-search">
          <span class="help-widget-search-icon">🔍</span>
          <input type="text" placeholder="Search for help..." oninput="HelpWidget.search(this.value)">
        </div>
      </div>
      <div class="help-widget-content">
        <div class="help-widget-section">
          <h4>Quick Links</h4>
          ${this.knowledgeBase.slice(0, 4).map(item => `
            <a href="${item.url}" class="help-widget-link">
              <span class="help-widget-link-icon">${item.icon}</span>
              <span>${item.title}</span>
            </a>
          `).join('')}
        </div>
        <div class="help-widget-section">
          <h4>Popular Shortcuts</h4>
          ${this.shortcuts.slice(0, 3).map(item => `
            <a href="#" class="help-widget-link" onclick="HelpWidget.showShortcut('${item.title}'); return false;">
              <span class="help-widget-link-icon">⌨️</span>
              <span>${item.title}</span>
            </a>
          `).join('')}
        </div>
      </div>
      <div class="help-widget-footer">
        <a href="/help">View all help →</a>
        <a href="mailto:support@slidetheory.io">Contact us</a>
      </div>
    `;
    
    document.querySelector('.help-widget').appendChild(this.panel);
  },
  
  toggle() {
    if (!this.panel) {
      this.createPanel();
    }
    
    this.isOpen = !this.isOpen;
    this.button.classList.toggle('active', this.isOpen);
    this.panel.classList.toggle('active', this.isOpen);
  },
  
  search(query) {
    const content = this.panel.querySelector('.help-widget-content');
    
    if (!query.trim()) {
      // Restore default view
      this.createPanel();
      return;
    }
    
    const results = this.knowledgeBase.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
      content.innerHTML = `
        <div class="help-search-no-results">
          <div class="help-search-no-results-icon">🔍</div>
          <p>No results found for "${query}"</p>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="help-search-results">
          ${results.map(item => `
            <div class="help-search-result" onclick="window.location.href='${item.url}'">
              <h5>${item.icon} ${item.title}</h5>
              <p>${item.desc}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
  },
  
  showShortcut(title) {
    const shortcut = this.shortcuts.find(s => s.title === title);
    if (shortcut) {
      showToast(`${shortcut.title}: Press ${shortcut.shortcut}`, 'info');
    }
  }
};

// ============================================
// VIDEO MODAL
// ============================================

const VideoModal = {
  modal: null,
  
  open(videoId, title = '') {
    if (this.modal) this.close();
    
    this.modal = document.createElement('div');
    this.modal.className = 'video-modal';
    this.modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close" onclick="VideoModal.close()">×</button>
        <div class="video-embed-container">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            title="${title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    document.body.appendChild(this.modal);
    
    requestAnimationFrame(() => {
      this.modal.classList.add('active');
    });
  },
  
  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      setTimeout(() => {
        this.modal.remove();
        this.modal = null;
      }, 300);
    }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'info') {
  // Use existing toast system if available
  if (window.showToast) {
    window.showToast(message, type);
    return;
  }
  
  // Simple fallback
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e293b;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize help widget
  HelpWidget.init();
  
  // Check if first visit
  const state = OnboardingState.load();
  
  if (!state.completed && !state.skipped) {
    // Start onboarding wizard
    OnboardingWizard.init();
  } else {
    // Show progress indicator
    OnboardingProgress.show();
  }
  
  // Track slide creation for badges/progress
  const v2Form = document.getElementById('slideFormV2');
  if (v2Form) {
    v2Form.addEventListener('submit', () => {
      OnboardingProgress.completeTask('createdFirstSlide');
      Badges.show('first_slide');
    });
  }
  
  // Track keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'Enter' || e.key === 'r' || e.key === 'R')) {
      OnboardingProgress.completeTask('exploredFeatures');
      Badges.show('power_user');
    }
  });
});

// Export for global access
window.OnboardingWizard = OnboardingWizard;
window.Tutorial = Tutorial;
window.OnboardingProgress = OnboardingProgress;
window.Badges = Badges;
window.HelpWidget = HelpWidget;
window.VideoModal = VideoModal;
window.OnboardingState = OnboardingState;
