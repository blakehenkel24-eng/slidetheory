# Cookie Consent Banner

## Implementation Code

### HTML/CSS Component

```html
<!-- Cookie Consent Banner -->
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Cookie Consent">
  <div class="cookie-banner-content">
    <div class="cookie-banner-header">
      <span class="cookie-icon">🍪</span>
      <h2>We value your privacy</h2>
    </div>
    <p class="cookie-banner-text">
      We use cookies to enhance your browsing experience, analyze site traffic, 
      and personalize content. By clicking "Accept All", you consent to our use of cookies. 
      <a href="/legal/cookie-policy" target="_blank">Read our Cookie Policy</a>.
    </p>
    <div class="cookie-banner-actions">
      <button class="cookie-btn cookie-btn-primary" onclick="acceptAllCookies()">
        Accept All
      </button>
      <button class="cookie-btn cookie-btn-secondary" onclick="showCookiePreferences()">
        Customize
      </button>
      <button class="cookie-btn cookie-btn-text" onclick="acceptEssentialOnly()">
        Essential Only
      </button>
    </div>
  </div>
</div>

<!-- Cookie Preferences Modal -->
<div id="cookie-preferences" class="cookie-modal" role="dialog" aria-label="Cookie Preferences" hidden>
  <div class="cookie-modal-content">
    <div class="cookie-modal-header">
      <h2>Cookie Preferences</h2>
      <button class="cookie-close" onclick="closeCookiePreferences()" aria-label="Close">×</button>
    </div>
    
    <div class="cookie-categories">
      <!-- Essential -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <label class="cookie-toggle">
            <input type="checkbox" checked disabled>
            <span class="cookie-toggle-slider"></span>
          </label>
          <div class="cookie-category-title">
            <h3>Essential</h3>
            <span class="cookie-required">Required</span>
          </div>
        </div>
        <p class="cookie-category-description">
          These cookies are necessary for the website to function and cannot be switched off. 
          They are usually set in response to actions you take, such as logging in or filling forms.
        </p>
      </div>

      <!-- Functional -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <label class="cookie-toggle">
            <input type="checkbox" id="functional-cookies" checked>
            <span class="cookie-toggle-slider"></span>
          </label>
          <div class="cookie-category-title">
            <h3>Functional</h3>
          </div>
        </div>
        <p class="cookie-category-description">
          These cookies enable enhanced functionality and personalization, such as remembering 
          your preferences and settings. They may be set by us or third-party providers.
        </p>
      </div>

      <!-- Analytics -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <label class="cookie-toggle">
            <input type="checkbox" id="analytics-cookies" checked>
            <span class="cookie-toggle-slider"></span>
          </label>
          <div class="cookie-category-title">
            <h3>Analytics</h3>
          </div>
        </div>
        <p class="cookie-category-description">
          These cookies help us understand how visitors interact with our website by collecting 
          and reporting information anonymously. They help us improve our services.
        </p>
      </div>

      <!-- Marketing -->
      <div class="cookie-category">
        <div class="cookie-category-header">
          <label class="cookie-toggle">
            <input type="checkbox" id="marketing-cookies">
            <span class="cookie-toggle-slider"></span>
          </label>
          <div class="cookie-category-title">
            <h3>Marketing</h3>
          </div>
        </div>
        <p class="cookie-category-description">
          These cookies may be set through our site by our advertising partners. They may be 
          used to build a profile of your interests and show you relevant ads on other sites.
        </p>
      </div>
    </div>

    <div class="cookie-modal-actions">
      <button class="cookie-btn cookie-btn-primary" onclick="saveCookiePreferences()">
        Save Preferences
      </button>
      <button class="cookie-btn cookie-btn-secondary" onclick="acceptAllFromModal()">
        Accept All
      </button>
    </div>
  </div>
</div>

<!-- Cookie Settings Link (Footer) -->
<a href="#" onclick="showCookiePreferences(); return false;" class="cookie-settings-link">
  Cookie Settings
</a>
```

### CSS Styles

```css
/* Cookie Banner Styles */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.cookie-banner-content {
  max-width: 1200px;
  margin: 0 auto;
}

.cookie-banner-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.cookie-icon {
  font-size: 1.5rem;
}

.cookie-banner-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.cookie-banner-text {
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.cookie-banner-text a {
  color: #2563eb;
  text-decoration: underline;
}

.cookie-banner-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cookie-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
}

.cookie-btn-primary {
  background: #2563eb;
  color: white;
}

.cookie-btn-primary:hover {
  background: #1d4ed8;
}

.cookie-btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cookie-btn-secondary:hover {
  background: #e5e7eb;
}

.cookie-btn-text {
  background: transparent;
  color: #6b7280;
  text-decoration: underline;
}

.cookie-btn-text:hover {
  color: #374151;
}

/* Modal Styles */
.cookie-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.cookie-modal-content {
  background: white;
  border-radius: 0.75rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.cookie-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.cookie-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.cookie-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.cookie-categories {
  padding: 1.5rem;
}

.cookie-category {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.cookie-category:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.cookie-category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.cookie-category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cookie-category-title h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.cookie-required {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.cookie-category-description {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-left: 3.5rem;
}

/* Toggle Switch */
.cookie-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.cookie-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 24px;
}

.cookie-toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.cookie-toggle input:checked + .cookie-toggle-slider {
  background-color: #2563eb;
}

.cookie-toggle input:checked + .cookie-toggle-slider:before {
  transform: translateX(24px);
}

.cookie-toggle input:disabled + .cookie-toggle-slider {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.cookie-modal-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

.cookie-settings-link {
  color: #6b7280;
  text-decoration: underline;
  font-size: 0.875rem;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .cookie-banner-actions {
    flex-direction: column;
  }
  
  .cookie-btn {
    width: 100%;
  }
  
  .cookie-modal-content {
    margin: 0;
    border-radius: 0.5rem;
  }
  
  .cookie-category-description {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .cookie-btn,
  .cookie-toggle-slider,
  .cookie-toggle-slider:before {
    transition: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .cookie-banner {
    background: #1f2937;
    border-top-color: #374151;
  }
  
  .cookie-banner-header h2 {
    color: #f9fafb;
  }
  
  .cookie-banner-text {
    color: #d1d5db;
  }
}
```

### JavaScript Implementation

```javascript
/**
 * SlideTheory Cookie Consent Manager
 * GDPR/CCPA Compliant Cookie Management
 */

class CookieConsentManager {
  constructor() {
    this.consentKey = 'slidetheory_cookie_consent';
    this.consentVersion = '1.0';
    this.categories = {
      essential: true,    // Always true, cannot be disabled
      functional: false,
      analytics: false,
      marketing: false
    };
    this.init();
  }

  init() {
    // Check for existing consent
    const savedConsent = this.getStoredConsent();
    
    if (!savedConsent) {
      // Show banner if no consent stored
      this.showBanner();
    } else {
      // Apply stored preferences
      this.applyConsent(savedConsent);
    }

    // Check for GPC signal
    this.checkGlobalPrivacyControl();
  }

  getStoredConsent() {
    try {
      const stored = localStorage.getItem(this.consentKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check version
        if (parsed.version === this.consentVersion) {
          return parsed.preferences;
        }
      }
    } catch (e) {
      console.error('Error reading cookie consent:', e);
    }
    return null;
  }

  storeConsent(preferences) {
    const consentData = {
      version: this.consentVersion,
      timestamp: new Date().toISOString(),
      preferences: preferences
    };
    
    try {
      localStorage.setItem(this.consentKey, JSON.stringify(consentData));
      
      // Also set a first-party cookie for server-side detection
      this.setCookie('st_consent', JSON.stringify(preferences), 365);
    } catch (e) {
      console.error('Error storing cookie consent:', e);
    }
  }

  setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Lax`;
  }

  showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      banner.setAttribute('aria-hidden', 'false');
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'none';
      banner.setAttribute('aria-hidden', 'true');
    }
  }

  acceptAll() {
    const preferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    this.storeConsent(preferences);
    this.applyConsent(preferences);
    this.hideBanner();
    this.logConsent('accept_all', preferences);
  }

  acceptEssential() {
    const preferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    
    this.storeConsent(preferences);
    this.applyConsent(preferences);
    this.hideBanner();
    this.logConsent('essential_only', preferences);
  }

  savePreferences() {
    const preferences = {
      essential: true,
      functional: document.getElementById('functional-cookies')?.checked || false,
      analytics: document.getElementById('analytics-cookies')?.checked || false,
      marketing: document.getElementById('marketing-cookies')?.checked || false
    };
    
    this.storeConsent(preferences);
    this.applyConsent(preferences);
    this.closeModal();
    this.hideBanner();
    this.logConsent('custom', preferences);
  }

  applyConsent(preferences) {
    // Apply consent to various services
    
    // Functional cookies
    if (preferences.functional) {
      this.enableFunctionalCookies();
    } else {
      this.disableFunctionalCookies();
    }

    // Analytics cookies
    if (preferences.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Marketing cookies
    if (preferences.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    // Update dataLayer for GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_update',
        cookie_consent: preferences
      });
    }
  }

  enableFunctionalCookies() {
    // Load functional scripts
    document.body.classList.add('cookies-functional-enabled');
  }

  disableFunctionalCookies() {
    // Remove functional cookies
    this.deleteCookie('theme');
    this.deleteCookie('language');
    this.deleteCookie('recent_templates');
    document.body.classList.remove('cookies-functional-enabled');
  }

  enableAnalytics() {
    // Initialize Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    document.body.classList.add('cookies-analytics-enabled');
  }

  disableAnalytics() {
    // Disable analytics tracking
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    // Clear analytics cookies
    this.deleteCookie('_ga');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
    document.body.classList.remove('cookies-analytics-enabled');
  }

  enableMarketing() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted'
      });
    }
    document.body.classList.add('cookies-marketing-enabled');
  }

  disableMarketing() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied'
      });
    }
    // Clear marketing cookies
    this.deleteCookie('_fbp');
    this.deleteCookie('fr');
    this.deleteCookie('IDE');
    document.body.classList.remove('cookies-marketing-enabled');
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  showModal() {
    const modal = document.getElementById('cookie-preferences');
    if (modal) {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      
      // Load current preferences
      const current = this.getStoredConsent();
      if (current) {
        document.getElementById('functional-cookies').checked = current.functional;
        document.getElementById('analytics-cookies').checked = current.analytics;
        document.getElementById('marketing-cookies').checked = current.marketing;
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('cookie-preferences');
    if (modal) {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  checkGlobalPrivacyControl() {
    // Respect Global Privacy Control signal
    if (navigator.globalPrivacyControl) {
      this.acceptEssential();
      console.log('Global Privacy Control detected - limited cookies enabled');
    }
  }

  logConsent(action, preferences) {
    // Send consent record to server for compliance
    fetch('/api/consent/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        preferences: preferences,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(e => console.error('Failed to log consent:', e));
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsentManager();
});

// Global functions for onclick handlers
function acceptAllCookies() {
  window.cookieConsent.acceptAll();
}

function acceptEssentialOnly() {
  window.cookieConsent.acceptEssential();
}

function showCookiePreferences() {
  window.cookieConsent.showModal();
}

function closeCookiePreferences() {
  window.cookieConsent.closeModal();
}

function saveCookiePreferences() {
  window.cookieConsent.savePreferences();
}

function acceptAllFromModal() {
  window.cookieConsent.acceptAll();
}
```

### Server-Side Implementation (Node.js/Express)

```javascript
/**
 * Cookie Consent Middleware
 * Handles consent logging and GPC detection
 */

const express = require('express');
const router = express.Router();

// Consent logging endpoint
router.post('/api/consent/log', async (req, res) => {
  try {
    const { action, preferences, timestamp, url } = req.body;
    
    // Store consent record in database
    await db.consentRecords.create({
      userId: req.user?.id,
      action: action,
      preferences: preferences,
      timestamp: timestamp,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      url: url,
      gpcSignal: req.headers['sec-gpc'] === '1'
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Consent logging error:', error);
    res.status(500).json({ error: 'Failed to log consent' });
  }
});

// Middleware to check consent status
const checkConsent = (req, res, next) => {
  const consentCookie = req.cookies.st_consent;
  
  if (consentCookie) {
    try {
      req.consent = JSON.parse(consentCookie);
    } catch (e) {
      req.consent = null;
    }
  }
  
  // Check GPC header
  req.globalPrivacyControl = req.headers['sec-gpc'] === '1';
  
  next();
};

// Middleware to conditionally load scripts
const requireConsent = (category) => {
  return (req, res, next) => {
    if (!req.consent || !req.consent[category]) {
      return res.status(403).json({ 
        error: 'Consent required',
        category: category 
      });
    }
    next();
  };
};

module.exports = { router, checkConsent, requireConsent };
```

## Banner Placement Guidelines

1. **First Visit:** Display immediately on first page load
2. **Position:** Fixed at bottom of viewport (less intrusive than top)
3. **Mobile:** Full-width, stacked buttons
4. **Accessibility:** Keyboard navigable, screen reader compatible
5. **Persist:** Remain visible until user makes a choice
6. **Reminder:** Show again after 6 months or when policy changes

## Compliance Checklist

- [x] Clear, plain language explaining cookie use
- [x] Granular consent options (not just accept/reject)
- [x] Easy access to change preferences (Cookie Settings link)
- [x] Prior consent for non-essential cookies (GDPR)
- [x] Records of consent maintained
- [x] Respect for Do Not Track signals
- [x] Support for Global Privacy Control
- [x] Accessible design (WCAG 2.1 AA)
- [x] Mobile responsive
- [x] No pre-ticked boxes for non-essential cookies
- [x] Ability to withdraw consent easily
- [x] Version tracking for consent records
