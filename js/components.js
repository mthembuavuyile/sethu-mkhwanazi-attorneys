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
          mobileMenuBtn.classList.add('open');
          if (iconOpen) iconOpen.classList.add('hidden');
          if (iconClose) iconClose.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mobileMenuBtn.classList.remove('open');
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

  function init404Search() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const quickGrid = document.getElementById('quick-links-grid');
    const resultsHeading = document.getElementById('results-heading');
    const resultsCount = document.getElementById('results-count');
    const searchTags = document.querySelectorAll('.search-tag');

    if (!searchInput || !quickGrid) return;

    // Cache initial default popular destinations markup
    const defaultGridHTML = quickGrid.innerHTML;
    const defaultHeadingText = resultsHeading ? resultsHeading.textContent : 'Popular Destinations';

    // Search Index of firm services and main pages
    const searchIndex = [
      {
        title: 'Civil & Commercial Litigation',
        category: 'Practice Area',
        url: 'services/civil-litigation.html',
        icon: 'scale',
        description: 'High Court & Magistrates Court litigation, debt recovery, contractual disputes, and interdicts.',
        keywords: ['civil litigation', 'court', 'magistrates', 'high court', 'dispute', 'debt recovery', 'contract breach', 'damages', 'litigation', 'lawsuit', 'summons', 'sue', 'trial', 'interdict']
      },
      {
        title: 'Corporate & Commercial Law',
        category: 'Practice Area',
        url: 'services/corporate-commercial-law.html',
        icon: 'building-2',
        description: 'Contract drafting, SME legal retainers, regulatory compliance, agreements, and corporate governance.',
        keywords: ['corporate', 'commercial', 'company', 'business', 'sme', 'retainer', 'contracts', 'service level agreement', 'sla', 'compliance', 'governance', 'shareholder', 'partnership', 'memorandum']
      },
      {
        title: 'Labour & Employment Law',
        category: 'Practice Area',
        url: 'services/labour-employment-law.html',
        icon: 'briefcase',
        description: 'CCMA representation, Labour Court disputes, unfair dismissal, disciplinary hearings, and employment contracts.',
        keywords: ['labour', 'employment', 'ccma', 'labour court', 'unfair dismissal', 'disciplinary hearing', 'retrenchment', 'section 189', 'workplace dispute', 'employee', 'employer', 'severance', 'strike']
      },
      {
        title: 'Family & Matrimonial Law',
        category: 'Practice Area',
        url: 'services/family-law-attorneys.html',
        icon: 'users',
        description: 'Divorce proceedings, child custody and maintenance, antenuptial contracts (ANC), and domestic protection.',
        keywords: ['family law', 'divorce', 'child custody', 'maintenance', 'antenuptial contract', 'anc', 'matrimonial', 'marriage', 'protection order', 'domestic violence', 'visitation', 'parental rights']
      },
      {
        title: 'Estate Planning & Wills',
        category: 'Practice Area',
        url: 'services/estate-planning-wills.html',
        icon: 'file-text',
        description: 'Administration of deceased estates, drafting of wills, family trusts, estate duty, and asset protection.',
        keywords: ['estate planning', 'wills', 'will drafting', 'deceased estate', 'executor', 'master of high court', 'trusts', 'inheritance', 'asset protection', 'testate', 'intestate', 'probate', 'letters of executorship']
      },
      {
        title: 'All Practice Areas & Services',
        category: 'Services Overview',
        url: 'services/index.html',
        icon: 'briefcase',
        description: 'Comprehensive overview of all specialized legal solutions and practice areas offered across South Africa.',
        keywords: ['services', 'practice areas', 'overview', 'all legal services', 'what we do', 'solutions', 'attorneys']
      },
      {
        title: 'Book a Consultation',
        category: 'Consultation',
        url: 'book-consultation.html',
        icon: 'calendar',
        description: 'Schedule an initial legal consultation session with Attorney Sethu Mkhwanazi and our legal team.',
        keywords: ['book', 'consultation', 'appointment', 'schedule', 'consult', 'fees', 'pricing', 'booking', 'meet lawyer', 'advice session']
      },
      {
        title: 'About the Firm',
        category: 'About Us',
        url: 'about.html',
        icon: 'shield-check',
        description: 'Discover the story behind Sethu Mkhwanazi Attorneys Inc., our founder narrative, mission, and ethos.',
        keywords: ['about', 'firm', 'sethu mkhwanazi', 'founder', 'story', 'history', 'mission', 'vision', 'values', 'attorney profile', 'experience']
      },
      {
        title: 'Contact Legal Team',
        category: 'Contact Us',
        url: 'contact.html',
        icon: 'phone-call',
        description: 'Get in touch directly via phone (031 007 6324), email, or visit our office at Regus Durban Country Club.',
        keywords: ['contact', 'phone', 'telephone', 'call', 'email', '0310076324', 'address', 'location', 'durban country club', 'regus', 'stamford hill', 'directions', 'office']
      },
      {
        title: 'Homepage',
        category: 'Navigation',
        url: 'index.html',
        icon: 'home',
        description: 'Return to the main homepage of Sethu Mkhwanazi Attorneys Inc. - Providing Effective Legal Solutions.',
        keywords: ['home', 'homepage', 'start', 'landing', 'welcome', 'main']
      },
      {
        title: 'Privacy Policy',
        category: 'Legal & POPIA',
        url: 'privacy.html',
        icon: 'shield',
        description: 'Learn about our Protection of Personal Information Act (POPIA) compliance and client privacy policies.',
        keywords: ['privacy policy', 'popia', 'data protection', 'information officer', 'security', 'privacy', 'confidentiality']
      },
      {
        title: 'Terms of Service',
        category: 'Legal & Terms',
        url: 'terms.html',
        icon: 'shield-check',
        description: 'Review the general terms and conditions governing the use of our website and services.',
        keywords: ['terms of service', 'terms and conditions', 'disclaimer', 'terms', 'website policy']
      }
    ];

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text, queryTokens) {
      if (!queryTokens || queryTokens.length === 0) return text;
      let result = text;
      queryTokens.forEach(token => {
        if (!token) return;
        const regex = new RegExp(`(${escapeRegExp(token)})`, 'gi');
        result = result.replace(regex, '<mark class="bg-accent/25 text-accent-foreground font-semibold px-0.5 rounded">$1</mark>');
      });
      return result;
    }

    function performSearch(query) {
      const trimmed = query.trim().toLowerCase();

      if (!trimmed) {
        // Reset to default
        quickGrid.innerHTML = defaultGridHTML;
        quickGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';
        if (resultsHeading) resultsHeading.textContent = defaultHeadingText;
        if (resultsCount) {
          resultsCount.textContent = '';
          resultsCount.classList.add('hidden');
        }
        if (searchClear) searchClear.classList.add('hidden');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        return;
      }

      if (searchClear) searchClear.classList.remove('hidden');

      const tokens = trimmed.split(/\s+/).filter(t => t.length > 0);

      // Score and rank matches
      const scoredResults = searchIndex.map(item => {
        let score = 0;
        const lowerTitle = item.title.toLowerCase();
        const lowerCat = item.category.toLowerCase();
        const lowerDesc = item.description.toLowerCase();
        const lowerKeywords = item.keywords.join(' ').toLowerCase();

        // Exact & phrase matches
        if (lowerTitle === trimmed) score += 100;
        else if (lowerTitle.startsWith(trimmed)) score += 60;
        else if (lowerTitle.includes(trimmed)) score += 40;

        if (lowerCat.includes(trimmed)) score += 30;
        if (lowerDesc.includes(trimmed)) score += 20;

        // Token matching
        let tokensMatched = 0;
        tokens.forEach(token => {
          let tokenFound = false;
          if (lowerTitle.includes(token)) {
            score += 25;
            tokenFound = true;
          }
          if (lowerKeywords.includes(token)) {
            score += 15;
            tokenFound = true;
          }
          if (lowerDesc.includes(token)) {
            score += 10;
            tokenFound = true;
          }
          if (lowerCat.includes(token)) {
            score += 10;
            tokenFound = true;
          }
          if (tokenFound) tokensMatched++;
        });

        // Require at least one token match or score
        if (tokensMatched === 0 && score === 0) {
          score = 0;
        }

        return { item, score };
      }).filter(res => res.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(res => res.item);

      // Render results
      if (resultsHeading) {
        resultsHeading.textContent = scoredResults.length > 0 ? 'Search Results' : 'No Results Found';
      }
      if (resultsCount) {
        resultsCount.textContent = `${scoredResults.length} ${scoredResults.length === 1 ? 'match' : 'matches'}`;
        resultsCount.classList.remove('hidden');
      }

      if (scoredResults.length === 0) {
        quickGrid.className = 'col-span-full';
        quickGrid.innerHTML = `
          <div class="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <i data-lucide="search-x" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-semibold text-foreground mb-1">No matches found for "${query.replace(/"/g, '&quot;')}"</h3>
            <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">
              We couldn't find an exact match for your query. Try searching for broader terms like <span class="text-foreground font-medium">"Litigation"</span>, <span class="text-foreground font-medium">"Divorce"</span>, <span class="text-foreground font-medium">"Contracts"</span>, or <span class="text-foreground font-medium">"Wills"</span>.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <a href="services/index.html" class="inline-flex items-center text-xs font-medium px-3.5 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                <i data-lucide="briefcase" class="w-3.5 h-3.5 mr-1.5"></i> Browse All Services
              </a>
              <a href="contact.html" class="inline-flex items-center text-xs font-medium px-3.5 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                <i data-lucide="phone-call" class="w-3.5 h-3.5 mr-1.5"></i> Contact Us Directly
              </a>
            </div>
          </div>
        `;
      } else {
        quickGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';
        quickGrid.innerHTML = scoredResults.map(item => `
          <a href="${item.url}"
            class="flex items-start justify-between p-3.5 rounded-lg border border-border/60 hover:border-accent/50 hover:bg-accent/5 transition-all group card-hover focus:outline-none focus:ring-2 focus:ring-accent"
            role="listitem">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-md bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0 mt-0.5">
                <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground">${item.category}</span>
                </div>
                <p class="text-sm font-medium text-foreground group-hover:text-accent transition-colors">${highlightText(item.title, tokens)}</p>
                <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">${highlightText(item.description, tokens)}</p>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 ml-2 mt-1"></i>
          </a>
        `).join('');
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    // Input event listener
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    // Clear button listener
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
      });
    }

    // Keyboard shortcuts
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        performSearch('');
      } else if (e.key === 'Enter') {
        const firstResult = quickGrid.querySelector('a');
        if (firstResult) {
          firstResult.click();
        }
      }
    });

    // Tag click listeners
    searchTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query') || tag.textContent.trim();
        searchInput.value = query;
        performSearch(query);
        searchInput.focus();
      });
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeader();
      initFooter();
      initIcons();
      init404Search();
    });
  } else {
    initHeader();
    initFooter();
    initIcons();
    init404Search();
  }
})();
