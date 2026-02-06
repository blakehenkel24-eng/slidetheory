/**
 * SlideTheory v2.0 - Frontend Application
 * MBB-Inspired Slide Generation with Knowledge Base
 * 
 * Updated for Vercel: Uses Supabase Edge Functions for API calls
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  supabaseUrl: 'https://your-project.supabase.co', // Update with your Supabase URL
  supabaseAnonKey: 'your-anon-key', // Update with your anon key
  apiBaseUrl: 'https://your-project.supabase.co/functions/v1', // Edge Functions base URL
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  version: 'v2',
  isGenerating: false,
  currentSlide: null,
  presentationMode: 'presentation',
  templates: {},
  currentJobId: null,
};

// ============================================
// API CLIENT
// ============================================
async function apiCall(endpoint, options = {}) {
  const url = `${CONFIG.apiBaseUrl}/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.supabaseAnonKey}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// DOM ELEMENTS
// ============================================
const v2Form = document.getElementById('slideFormV2');
const v2Elements = {
  slideType: document.getElementById('slideTypeV2'),
  audience: document.getElementById('audienceV2'),
  keyTakeaway: document.getElementById('keyTakeawayV2'),
  context: document.getElementById('contextV2'),
  dataInput: document.getElementById('dataInputV2'),
  dataFile: document.getElementById('dataFileV2'),
  generateBtn: document.getElementById('generateBtnV2'),
  generateIcon: document.getElementById('generateIconV2'),
  generateText: document.getElementById('generateTextV2'),
  fileName: document.getElementById('fileNameV2'),
  counters: {
    keyTakeaway: document.getElementById('keyTakeawayCounterV2'),
    context: document.getElementById('contextCounterV2')
  },
  toggles: {
    presentation: document.getElementById('modePresentationV2'),
    read: document.getElementById('modeReadV2')
  }
};

// ============================================
// TEMPLATES
// ============================================
async function loadTemplates() {
  try {
    const data = await apiCall('get-templates');
    state.templates = data.templates || [];
    populateTemplateSelect();
  } catch (error) {
    console.error('Failed to load templates:', error);
    // Use fallback templates
    state.templates = [
      { id: 'executive-summary', name: 'Executive Summary' },
      { id: 'market-analysis', name: 'Market Analysis' },
      { id: 'financial-model', name: 'Financial Model' },
      { id: 'recommendation', name: 'Recommendation' },
    ];
    populateTemplateSelect();
  }
}

function populateTemplateSelect() {
  const select = v2Elements.slideType;
  select.innerHTML = '<option value="">Select slide type...</option>';
  state.templates.forEach(template => {
    const option = document.createElement('option');
    option.value = template.id;
    option.textContent = template.name;
    select.appendChild(option);
  });
}

// ============================================
// GENERATE SLIDE
// ============================================
async function generateSlide() {
  if (state.isGenerating) return;
  
  const formData = {
    slideType: v2Elements.slideType.value,
    audience: v2Elements.audience.value,
    keyTakeaway: v2Elements.keyTakeaway.value,
    context: v2Elements.context.value,
    data: v2Elements.dataInput.value,
    mode: state.presentationMode,
  };

  // Validation
  if (!formData.slideType || !formData.keyTakeaway || !formData.context) {
    showError('Please fill in all required fields');
    return;
  }

  setGeneratingState(true);

  try {
    const prompt = buildPrompt(formData);
    
    const result = await apiCall('generate-slide', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        slideType: formData.slideType,
        audience: formData.audience,
      }),
    });

    state.currentJobId = result.jobId;
    displaySlide(result.content);
    
  } catch (error) {
    console.error('Generation failed:', error);
    showError('Failed to generate slide. Please try again.');
  } finally {
    setGeneratingState(false);
  }
}

function buildPrompt(formData) {
  return `Create a ${formData.slideType} slide for ${formData.audience} audience.

Key Takeaway: ${formData.keyTakeaway}

Context:
${formData.context}

${formData.data ? `Data:\n${formData.data}` : ''}

Mode: ${formData.mode}

Please provide the slide content in a structured format.`;
}

function displaySlide(content) {
  // Update the preview area with generated content
  const previewContainer = document.getElementById('slidePreview');
  if (previewContainer) {
    previewContainer.innerHTML = `
      <div class="generated-slide">
        <pre>${content}</pre>
      </div>
    `;
  }
  state.currentSlide = { content };
}

// ============================================
// EXPORT
// ============================================
async function exportSlide(format) {
  if (!state.currentSlide) {
    showError('No slide to export');
    return;
  }

  try {
    const result = await apiCall('export-slide', {
      method: 'POST',
      body: JSON.stringify({
        format,
        content: state.currentSlide.content,
        slideId: state.currentJobId,
      }),
    });

    // Trigger download
    window.open(result.downloadUrl, '_blank');
  } catch (error) {
    console.error('Export failed:', error);
    showError('Export failed. Please try again.');
  }
}

// ============================================
// UI HELPERS
// ============================================
function setGeneratingState(isGenerating) {
  state.isGenerating = isGenerating;
  v2Elements.generateBtn.disabled = isGenerating;
  v2Elements.generateText.textContent = isGenerating ? 'Generating...' : 'Generate Slide';
  v2Elements.generateIcon.className = isGenerating 
    ? 'fas fa-spinner fa-spin' 
    : 'fas fa-wand-magic-sparkles';
}

function showError(message) {
  // Implement error toast/notification
  console.error(message);
  alert(message);
}

function updateCounter(element, counter, maxLength) {
  const length = element.value.length;
  counter.textContent = `${length}/${maxLength}`;
  counter.classList.toggle('text-red-500', length > maxLength);
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();

  // Form submission
  if (v2Form) {
    v2Form.addEventListener('submit', (e) => {
      e.preventDefault();
      generateSlide();
    });
  }

  // Generate button
  if (v2Elements.generateBtn) {
    v2Elements.generateBtn.addEventListener('click', generateSlide);
  }

  // Mode toggles
  if (v2Elements.toggles.presentation) {
    v2Elements.toggles.presentation.addEventListener('change', () => {
      state.presentationMode = 'presentation';
    });
  }
  if (v2Elements.toggles.read) {
    v2Elements.toggles.read.addEventListener('change', () => {
      state.presentationMode = 'read';
    });
  }

  // Counters
  if (v2Elements.keyTakeaway && v2Elements.counters.keyTakeaway) {
    v2Elements.keyTakeaway.addEventListener('input', () => {
      updateCounter(v2Elements.keyTakeaway, v2Elements.counters.keyTakeaway, 200);
    });
  }
  if (v2Elements.context && v2Elements.counters.context) {
    v2Elements.context.addEventListener('input', () => {
      updateCounter(v2Elements.context, v2Elements.counters.context, 2000);
    });
  }
});

// Export functions for global access
window.SlideTheory = {
  generate: generateSlide,
  export: exportSlide,
  state,
};
