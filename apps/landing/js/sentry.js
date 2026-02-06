/**
 * Browser Sentry Integration
 * 
 * Include this script in your HTML pages for client-side error tracking.
 * Add before closing </body> tag or in <head> with defer.
 */

(function() {
  'use strict';
  
  // Only initialize if DSN is available
  const SENTRY_DSN = window.SENTRY_DSN || null;
  
  if (!SENTRY_DSN) {
    console.log('[Sentry] Browser DSN not configured');
    return;
  }
  
  // Load Sentry from CDN
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/7.100.1/bundle.tracing.min.js';
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  script.onload = function() {
    window.Sentry.init({
      dsn: SENTRY_DSN,
      environment: window.SENTRY_ENVIRONMENT || 'production',
      release: window.SENTRY_RELEASE || '2.0.0',
      
      // Performance monitoring
      tracesSampleRate: 0.1, // Sample 10% of page loads
      
      // Replay sampling (optional)
      // replaysSessionSampleRate: 0.01,
      // replaysOnErrorSampleRate: 1.0,
      
      // Before send to scrub sensitive data
      beforeSend: function(event) {
        // Remove sensitive URL parameters
        if (event.request && event.request.url) {
          try {
            const url = new URL(event.request.url);
            // Remove tokens, keys, passwords
            ['token', 'api_key', 'apikey', 'key', 'password', 'secret'].forEach(param => {
              url.searchParams.delete(param);
            });
            event.request.url = url.toString();
          } catch (e) {
            // URL parsing failed, leave as is
          }
        }
        
        // Remove PII from user context
        if (event.user) {
          delete event.user.email;
          delete event.user.name;
          delete event.user.username;
          delete event.user.ip_address;
        }
        
        return event;
      },
      
      // Ignore common browser errors
      ignoreErrors: [
        // Network errors
        'Network Error',
        'Failed to fetch',
        'Network request failed',
        'AbortError',
        // Safari errors
        'Cancel',
        // Chrome internal errors
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications.',
        // Facebook
        'fb_xd_fragment',
        // Common spam
        /^.*extension.*$/i,
        /^.*plugin.*$/i
      ],
      
      // Deny certain URLs
      denyUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /^chrome-extension:\/\//i,
        /^moz-extension:\/\//i,
        /^safari-extension:\/\//i
      ]
    });
    
    console.log('[Sentry] Browser monitoring active');
    
    // Set user context if available
    if (window.CURRENT_USER && window.CURRENT_USER.id) {
      window.Sentry.setUser({
        id: window.CURRENT_USER.id,
        role: window.CURRENT_USER.role
      });
    }
    
    // Track page performance
    if (window.performance) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const timing = window.performance.timing;
          const metrics = {
            // Time to first byte
            ttfb: timing.responseStart - timing.navigationStart,
            // DOM ready
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            // Full page load
            loadTime: timing.loadEventEnd - timing.navigationStart
          };
          
          // Add as breadcrumb
          window.Sentry.addBreadcrumb({
            category: 'performance',
            message: 'Page load metrics',
            data: metrics,
            level: 'info'
          });
        }, 0);
      });
    }
  };
  
  script.onerror = function() {
    console.warn('[Sentry] Failed to load Sentry script');
  };
  
  document.head.appendChild(script);
})();
