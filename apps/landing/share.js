/**
 * SlideTheory Share System
 * Handles shareable links, URL encoding/decoding, and social sharing
 */

(function() {
  'use strict';

  const ShareSystem = {
    // Generate a unique slide ID
    generateSlideId() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    // Encode slide data to URL-safe string
    encodeSlideData(data) {
      try {
        const jsonString = JSON.stringify(data);
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch (e) {
        console.error('Failed to encode slide data:', e);
        return null;
      }
    },

    // Decode slide data from URL-safe string
    decodeSlideData(encoded) {
      try {
        // Restore base64 padding
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const jsonString = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(jsonString);
      } catch (e) {
        console.error('Failed to decode slide data:', e);
        return null;
      }
    },

    // Generate shareable URL
    generateShareUrl(slideData) {
      const encoded = this.encodeSlideData(slideData);
      if (!encoded) return null;
      
      const baseUrl = window.location.origin;
      return `${baseUrl}/s/${encoded}`;
    },

    // Parse slide data from URL
    parseUrlSlideData() {
      const path = window.location.pathname;
      const match = path.match(/\/s\/(.+)/);
      if (match) {
        return this.decodeSlideData(match[1]);
      }
      return null;
    },

    // Check if we're on a shared slide page
    isSharedSlidePage() {
      return window.location.pathname.startsWith('/s/');
    },

    // Share via Web Share API
    async shareNative(data) {
      const shareData = {
        title: data.title || 'Slide from SlideTheory',
        text: data.text || 'Check out this slide I created with SlideTheory!',
        url: data.url
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          this.trackShare('native');
          return true;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
          }
          return false;
        }
      }
      return false;
    },

    // Share to Twitter/X
    shareTwitter(url, text) {
      const shareText = encodeURIComponent(text || 'Check out this slide I created with SlideTheory! 🚀');
      const shareUrl = encodeURIComponent(url);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
      window.open(twitterUrl, '_blank', 'width=550,height=420');
      this.trackShare('twitter');
    },

    // Share to LinkedIn
    shareLinkedIn(url, title) {
      const shareUrl = encodeURIComponent(url);
      const shareTitle = encodeURIComponent(title || 'Slide from SlideTheory');
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
      window.open(linkedInUrl, '_blank', 'width=550,height=420');
      this.trackShare('linkedin');
    },

    // Share via Email
    shareEmail(url, title) {
      const subject = encodeURIComponent(title || 'Slide from SlideTheory');
      const body = encodeURIComponent(`I created this slide using SlideTheory:\n\n${url}\n\nCreate your own at https://slidetheory.io`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      this.trackShare('email');
    },

    // Copy to clipboard
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.trackShare('clipboard');
        return true;
      } catch (err) {
        console.error('Copy failed:', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          this.trackShare('clipboard');
          return true;
        } catch (e) {
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },

    // Track share events
    trackShare(method) {
      if (window.plausible) {
        plausible('Share', { props: { method } });
      }
      
      // Also track with custom event for other analytics
      window.dispatchEvent(new CustomEvent('slide-share', { 
        detail: { method, timestamp: Date.now() }
      }));
    },

    // Save slide to localStorage
    saveSlide(slideId, slideData) {
      try {
        const saved = this.getSavedSlides();
        saved[slideId] = {
          ...slideData,
          savedAt: Date.now()
        };
        localStorage.setItem('slidetheory_slides', JSON.stringify(saved));
        return true;
      } catch (e) {
        console.error('Failed to save slide:', e);
        return false;
      }
    },

    // Get saved slides from localStorage
    getSavedSlides() {
      try {
        const saved = localStorage.getItem('slidetheory_slides');
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        return {};
      }
    },

    // Get a specific saved slide
    getSavedSlide(slideId) {
      const saved = this.getSavedSlides();
      return saved[slideId] || null;
    },

    // Delete a saved slide
    deleteSavedSlide(slideId) {
      try {
        const saved = this.getSavedSlides();
        delete saved[slideId];
        localStorage.setItem('slidetheory_slides', JSON.stringify(saved));
        return true;
      } catch (e) {
        return false;
      }
    },

    // Get recent slides (last 10)
    getRecentSlides() {
      const saved = this.getSavedSlides();
      return Object.entries(saved)
        .sort((a, b) => b[1].savedAt - a[1].savedAt)
        .slice(0, 10)
        .map(([id, data]) => ({ id, ...data }));
    },

    // Initialize share modal
    initShareModal() {
      const modal = document.getElementById('shareModal');
      const closeBtn = document.getElementById('closeShareModal');
      const copyBtn = document.getElementById('copyShareUrl');
      const shareTwitterBtn = document.getElementById('shareTwitter');
      const shareLinkedInBtn = document.getElementById('shareLinkedIn');
      const shareEmailBtn = document.getElementById('shareEmail');

      if (!modal) return;

      // Close modal handlers
      const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      };

      closeBtn?.addEventListener('click', closeModal);
      modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

      // Copy URL
      copyBtn?.addEventListener('click', async () => {
        const urlInput = document.getElementById('shareUrlInput');
        if (urlInput) {
          const success = await this.copyToClipboard(urlInput.value);
          if (success) {
            copyBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            `;
            setTimeout(() => {
              copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              `;
            }, 2000);
          }
        }
      });

      // Social shares
      shareTwitterBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = document.getElementById('shareUrlInput')?.value;
        if (url) this.shareTwitter(url);
      });

      shareLinkedInBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = document.getElementById('shareUrlInput')?.value;
        if (url) this.shareLinkedIn(url);
      });

      shareEmailBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const url = document.getElementById('shareUrlInput')?.value;
        const title = document.getElementById('previewTitle')?.textContent;
        if (url) this.shareEmail(url, title);
      });
    },

    // Initialize embed modal
    initEmbedModal() {
      const modal = document.getElementById('embedModal');
      const closeBtn = document.getElementById('closeEmbedModal');
      const copyBtn = document.getElementById('copyEmbedCode');
      const widgetOptions = document.querySelectorAll('.widget-options input');

      if (!modal) return;

      const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      };

      closeBtn?.addEventListener('click', closeModal);
      modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

      // Copy embed code
      copyBtn?.addEventListener('click', async () => {
        const embedCode = document.getElementById('embedCode');
        if (embedCode) {
          const success = await this.copyToClipboard(embedCode.value);
          if (success) {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy Embed Code';
            }, 2000);
          }
        }
      });

      // Update embed code when options change
      widgetOptions?.forEach(option => {
        option.addEventListener('change', () => this.updateEmbedCode());
      });
    },

    // Update embed code based on options
    updateEmbedCode() {
      const showHeader = document.getElementById('widgetShowHeader')?.checked ?? true;
      const showFooter = document.getElementById('widgetShowFooter')?.checked ?? true;
      const darkMode = document.getElementById('widgetDarkMode')?.checked ?? false;

      const params = new URLSearchParams();
      if (!showHeader) params.set('header', 'false');
      if (!showFooter) params.set('footer', 'false');
      if (darkMode) params.set('theme', 'dark');

      const baseUrl = window.location.origin;
      const embedUrl = `${baseUrl}/embed${params.toString() ? '?' + params.toString() : ''}`;
      
      const embedCode = document.getElementById('embedCode');
      if (embedCode) {
        embedCode.value = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" title="SlideTheory - AI Slide Generator"></iframe>`;
      }
    },

    // Open share modal with slide data
    openShareModal(slideData) {
      const modal = document.getElementById('shareModal');
      const urlInput = document.getElementById('shareUrlInput');
      const shareUrlSection = document.getElementById('shareUrlSection');

      if (!modal) return;

      // Generate or use existing URL
      let shareUrl;
      if (slideData) {
        shareUrl = this.generateShareUrl(slideData);
        if (shareUrl) {
          // Save slide data
          const slideId = this.generateSlideId();
          this.saveSlide(slideId, slideData);
        }
      } else {
        // Use current URL
        shareUrl = window.location.href;
      }

      if (urlInput) {
        urlInput.value = shareUrl || window.location.href;
      }

      // Show/hide URL section based on whether we have shareable data
      if (shareUrlSection) {
        shareUrlSection.style.display = shareUrl ? 'block' : 'none';
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Track
      if (window.plausible) {
        plausible('Share Modal Opened');
      }
    },

    // Open embed modal
    openEmbedModal() {
      const modal = document.getElementById('embedModal');
      if (!modal) return;

      this.updateEmbedCode();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      if (window.plausible) {
        plausible('Embed Modal Opened');
      }
    }
  };

  // Make globally available
  window.ShareSystem = ShareSystem;

  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ShareSystem.initShareModal();
      ShareSystem.initEmbedModal();
    });
  } else {
    ShareSystem.initShareModal();
    ShareSystem.initEmbedModal();
  }
})();
