/**
 * SlideTheory Performance-Optimized App
 * With lazy loading, code splitting, and bundle optimization
 */

// ============================================
// LAZY LOADING UTILITIES
// ============================================

/**
 * Lazy load an image with intersection observer
 */
function lazyLoadImage(imgElement, src, options = {}) {
  return new Promise((resolve, reject) => {
    if (!imgElement) {
      reject(new Error('No image element provided'));
      return;
    }
    
    // Use native loading="lazy" if supported
    if ('loading' in HTMLImageElement.prototype) {
      imgElement.loading = 'lazy';
      imgElement.src = src;
      resolve(imgElement);
      return;
    }
    
    // Fallback to IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
          resolve(imgElement);
        }
      });
    }, {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1
    });
    
    observer.observe(imgElement);
    
    // Timeout fallback
    setTimeout(() => {
      observer.unobserve(imgElement);
      imgElement.src = src;
      resolve(imgElement);
    }, options.timeout || 5000);
  });
}

/**
 * Lazy load a module/component
 */
function lazyLoadModule(importFn, fallback = null) {
  return async (...args) => {
    try {
      const module = await importFn();
      return module.default || module;
    } catch (error) {
      console.error('[LazyLoad] Module load failed:', error);
      return fallback;
    }
  };
}

// ============================================
// DYNAMIC IMPORTS FOR HEAVY FEATURES
// ============================================

// Lazy load heavy libraries only when needed
const exporters = {
  pptx: null,
  pdf: null
};

async function loadExporter(type) {
  if (exporters[type]) return exporters[type];
  
  // These would be actual module imports in a real webpack/vite setup
  // For now, we'll simulate with dynamic import patterns
  switch (type) {
    case 'pptx':
      // Simulated: await import('pptxgenjs')
      exporters.pptx = true;
      return exporters.pptx;
    case 'pdf':
      // Simulated: await import('jspdf')
      exporters.pdf = true;
      return exporters.pdf;
    default:
      return null;
  }
}

// ============================================
// VIRTUAL SCROLLING FOR LARGE LISTS
// ============================================

class VirtualScroller {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 100;
    this.buffer = options.buffer || 5;
    this.items = options.items || [];
    this.renderItem = options.renderItem || (() => document.createElement('div'));
    
    this.visibleItems = new Map();
    this.scrollTop = 0;
    this.containerHeight = 0;
    
    this.init();
  }
  
  init() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    
    // Create spacer for total height
    this.spacer = document.createElement('div');
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
    this.container.appendChild(this.spacer);
    
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
    
    this.onResize();
    this.render();
  }
  
  onResize() {
    this.containerHeight = this.container.clientHeight;
    this.render();
  }
  
  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.render();
  }
  
  render() {
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
    const endIndex = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.buffer
    );
    
    // Remove items that are no longer visible
    for (const [index, element] of this.visibleItems) {
      if (index < startIndex || index >= endIndex) {
        element.remove();
        this.visibleItems.delete(index);
      }
    }
    
    // Add new visible items
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        const element = this.renderItem(this.items[i], i);
        element.style.position = 'absolute';
        element.style.top = `${i * this.itemHeight}px`;
        element.style.height = `${this.itemHeight}px`;
        element.style.width = '100%';
        this.container.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }
  
  destroy() {
    this.container.removeEventListener('scroll', this.onScroll);
    this.resizeObserver.disconnect();
    for (const element of this.visibleItems.values()) {
      element.remove();
    }
    this.spacer.remove();
  }
}

// ============================================
// LAZY SLIDE PREVIEW COMPONENT
// ============================================

class LazySlidePreview {
  constructor(container) {
    this.container = container;
    this.observer = null;
    this.previews = new Map();
  }
  
  init() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { rootMargin: '100px', threshold: 0.1 }
    );
  }
  
  addPreview(slideId, placeholderElement, loadFn) {
    this.previews.set(slideId, { element: placeholderElement, loadFn, loaded: false });
    this.observer.observe(placeholderElement);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideId = entry.target.dataset.slideId;
        const preview = this.previews.get(slideId);
        
        if (preview && !preview.loaded) {
          preview.loaded = true;
          preview.loadFn(entry.target);
          this.observer.unobserve(entry.target);
        }
      }
    });
  }
  
  destroy() {
    this.observer.disconnect();
    this.previews.clear();
  }
}

// ============================================
// CODE SPLITTING - DYNAMIC MODULE LOADER
// ============================================

const moduleCache = new Map();

async function loadModule(name) {
  if (moduleCache.has(name)) {
    return moduleCache.get(name);
  }
  
  const moduleLoaders = {
    // These would be actual dynamic imports
    'chart-renderer': () => Promise.resolve({ render: (data) => console.log('Chart:', data) }),
    'data-parser': () => Promise.resolve({ parse: (data) => data }),
    'export-handler': () => Promise.resolve({ export: (format) => console.log('Export:', format) })
  };
  
  if (moduleLoaders[name]) {
    const module = await moduleLoaders[name]();
    moduleCache.set(name, module);
    return module;
  }
  
  throw new Error(`Module ${name} not found`);
}

// ============================================
// PERFORMANCE MONITORING (CLIENT-SIDE)
// ============================================

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: {},
      resources: [],
      userTimings: [],
      customMetrics: {}
    };
  }
  
  init() {
    // Capture navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => this.collectNavigationTiming(), 0);
    });
    
    // Observe performance entries
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.metrics.resources.push({
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource', 'measure'] });
    }
  }
  
  collectNavigationTiming() {
    const timing = performance.timing || performance.getEntriesByType('navigation')[0];
    
    if (timing) {
      this.metrics.navigation = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connect: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart
      };
    }
  }
  
  mark(name) {
    if (performance.mark) {
      performance.mark(name);
    }
  }
  
  measure(name, startMark, endMark) {
    if (performance.measure) {
      performance.measure(name, startMark, endMark);
      
      const entries = performance.getEntriesByName(name);
      if (entries.length > 0) {
        this.metrics.customMetrics[name] = entries[entries.length - 1].duration;
      }
    }
  }
  
  recordSlideGeneration(duration, cached) {
    this.metrics.customMetrics.slideGeneration = duration;
    this.metrics.customMetrics.cacheHit = cached;
    
    // Send to analytics if available
    if (window.gtag) {
      gtag('event', 'slide_generation', {
        event_category: 'performance',
        event_label: cached ? 'cached' : 'new',
        value: Math.round(duration)
      });
    }
  }
  
  getReport() {
    return {
      ...this.metrics,
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null
    };
  }
}

// ============================================
// BUNDLE OPTIMIZATION - TREE SHAKING HELPERS
// ============================================

// Use object destructuring for tree-shakeable imports
const utils = {
  debounce: (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  },
  
  throttle: (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }
};

// ============================================
// SERVICE WORKER FOR OFFLINE SUPPORT
// ============================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[SW] Registered:', registration.scope);
        })
        .catch(error => {
          console.log('[SW] Registration failed:', error);
        });
    });
  }
}

// ============================================
// EXPORT FOR USE IN MAIN APP
// ============================================

window.SlideTheoryPerf = {
  lazyLoadImage,
  lazyLoadModule,
  VirtualScroller,
  LazySlidePreview,
  loadModule,
  loadExporter,
  PerformanceMonitor,
  utils,
  registerServiceWorker
};
