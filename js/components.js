/**
 * Sethu Mkhwanazi Attorneys Inc.
 * Standardized Component & Interaction Controller
 * Fast, accessible, SEO-optimized, lightweight.
 */

(function () {
  'use strict';

  function initHeader() {
    const header = document.getElementById('main-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    // Dynamic scroll effect for transparent headers
    if (header) {
      const isInitiallyTransparent = header.classList.contains('bg-transparent');

      const handleScroll = () => {
        if (isInitiallyTransparent) {
          if (window.scrollY > 20) {
            header.classList.add('bg-background/95', 'backdrop-blur-md', 'border-b', 'border-border', 'shadow-sm');
            header.classList.remove('bg-transparent');
          } else {
            header.classList.remove('bg-background/95', 'backdrop-blur-md', 'border-b', 'border-border', 'shadow-sm');
            header.classList.add('bg-transparent');
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    // Mobile menu toggle with full ARIA accessibility
    if (mobileMenuBtn && mobileMenu) {
      const toggleMenu = (open) => {
        const isOpen = typeof open === 'boolean' ? open : mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.remove('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
          if (iconOpen) iconOpen.classList.add('hidden');
          if (iconClose) iconClose.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        }
      };

      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          toggleMenu(false);
          mobileMenuBtn.focus();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          if (!mobileMenu.classList.contains('hidden')) {
            toggleMenu(false);
          }
        }
      });
    }
  }

  function initFooter() {
    // Dynamic copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initIcons() {
    // Initialize Lucide icons if loaded
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeader();
      initFooter();
      initIcons();
    });
  } else {
    initHeader();
    initFooter();
    initIcons();
  }
})();
