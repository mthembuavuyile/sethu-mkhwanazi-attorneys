/**
 * Sethu Mkhwanazi Attorneys Inc.
 * Interactive Legal Service Navigator
 * 
 * Zero-typing, button-driven decision-tree engine.
 * Users click through options; leaf nodes perform real actions
 * (open pages, WhatsApp, pre-fill forms, call, maps, email).
 */

(function () {
  'use strict';

  // ─── Decision Tree ──────────────────────────────────────────────
  // Each node: { message, options[] }
  // Each option: { label, icon, goto | action }
  //   goto: string  → navigates to another node
  //   action: object → performs a real-world action
  //     action.type: 'page' | 'whatsapp' | 'call' | 'email' | 'maps' | 'consult'
  //     action.url / action.text / action.area / action.mode etc.

  const WHATSAPP_NUMBER = '27825945643';
  const PHONE_NUMBER = '0310076324';
  const EMAIL = 'info@sethumkhwanaziattorneys.co.za';
  const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Regus+Durban+Country+Club+101+Isaiah+Ntshangase+Road+Stamford+Hill+Durban';

  const TREE = {
    // ─── Root ───
    root: {
      message: 'Welcome to <strong>Sethu Mkhwanazi Attorneys</strong>. How can we help you today?',
      options: [
        { label: 'I need legal help',       icon: 'scale',       goto: 'legal_help' },
        { label: 'Book a consultation',      icon: 'calendar',    goto: 'consult_flow' },
        { label: 'Find our office',          icon: 'map-pin',     goto: 'location' },
        { label: 'Office hours & contact',   icon: 'clock',       goto: 'contact_info' },
        { label: 'About the firm',           icon: 'shield-check', goto: 'about' },
      ],
    },

    // ─── Legal Help → Practice Area Selector ───
    legal_help: {
      message: 'What kind of legal matter are you dealing with?',
      options: [
        { label: 'Civil Litigation',           icon: 'gavel',        goto: 'civil' },
        { label: 'Corporate & Commercial',     icon: 'building-2',   goto: 'corporate' },
        { label: 'Labour & Employment',        icon: 'hard-hat',     goto: 'labour' },
        { label: 'Family Law',                 icon: 'users',        goto: 'family' },
        { label: 'Estate Planning & Wills',    icon: 'scroll-text',  goto: 'estate' },
        { label: "I'm not sure / Other",       icon: 'help-circle',  goto: 'not_sure' },
      ],
    },

    // ── Civil Litigation ──
    civil: {
      message: 'We handle <strong>civil & commercial disputes</strong>, including breach of contract, debt recovery, and dispute resolution through negotiation, mediation, or litigation.',
      options: [
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'civil' } },
        { label: 'Learn more',          icon: 'book-open',      action: { type: 'page', url: 'services/civil-litigation.html' } },
        { label: 'WhatsApp enquiry',    icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I would like to enquire about Civil Litigation services.' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ── Corporate & Commercial ──
    corporate: {
      message: 'We assist businesses with <strong>contracts, compliance, corporate governance</strong>, and commercial agreements. We also offer <strong>SME legal retainers</strong> for ongoing support.',
      options: [
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'corporate' } },
        { label: 'Learn more',          icon: 'book-open',      action: { type: 'page', url: 'services/corporate-commercial-law.html' } },
        { label: 'WhatsApp enquiry',    icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I would like to enquire about Corporate & Commercial Law services.' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ── Labour & Employment ──
    labour: {
      message: 'We handle <strong>unfair dismissals, retrenchments, CCMA matters</strong>, employment contracts, and workplace disputes for both employers and employees.',
      options: [
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'labour' } },
        { label: 'Learn more',          icon: 'book-open',      action: { type: 'page', url: 'services/labour-employment-law.html' } },
        { label: 'WhatsApp enquiry',    icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I would like to enquire about Labour & Employment Law services.' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ── Family Law ──
    family: {
      message: 'We provide sensitive legal support for <strong>divorce, maintenance, custody, domestic violence</strong>, and other family-related matters.',
      options: [
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'family' } },
        { label: 'Learn more',          icon: 'book-open',      action: { type: 'page', url: 'services/family-law-attorneys.html' } },
        { label: 'WhatsApp enquiry',    icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I would like to enquire about Family Law services.' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ── Estate Planning ──
    estate: {
      message: 'We assist with <strong>drafting wills, estate administration, trusts</strong>, and ensuring your assets are distributed according to your wishes.',
      options: [
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'estate' } },
        { label: 'Learn more',          icon: 'book-open',      action: { type: 'page', url: 'services/estate-planning-wills.html' } },
        { label: 'WhatsApp enquiry',    icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I would like to enquire about Estate Planning & Wills services.' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ── Not Sure / Other ──
    not_sure: {
      message: "No problem — our team can help identify the right approach for your situation. Choose how you'd like to get in touch:",
      options: [
        { label: 'WhatsApp us',         icon: 'message-circle', action: { type: 'whatsapp', text: 'Hello, I have a legal matter and would like some guidance on how you can assist.' } },
        { label: 'Call us',             icon: 'phone',          action: { type: 'call' } },
        { label: 'Send an enquiry',     icon: 'mail',           action: { type: 'page', url: 'contact.html' } },
        { label: 'Book consultation',   icon: 'calendar',       action: { type: 'consult', area: 'other' } },
        { label: 'Back',               icon: 'arrow-left',     goto: 'legal_help' },
      ],
    },

    // ─── Consultation Flow ───
    consult_flow: {
      message: 'Consultations are available <strong>virtually</strong> (Teams, Zoom, or phone) or <strong>in-person</strong> at our Durban office. Which do you prefer?',
      options: [
        { label: 'Virtual consultation',  icon: 'monitor',   action: { type: 'consult', mode: 'virtual' } },
        { label: 'In-person consultation', icon: 'building',  action: { type: 'consult', mode: 'in-person' } },
        { label: "Not sure yet",          icon: 'help-circle', goto: 'consult_info' },
        { label: 'Back',                 icon: 'arrow-left', goto: 'root' },
      ],
    },

    consult_info: {
      message: '<strong>Virtual:</strong> Held via Microsoft Teams, Zoom, or telephone — convenient and flexible.<br><br><strong>In-person:</strong> At Regus, Durban Country Club — a professional, confidential setting.<br><br>Both formats provide the same thorough legal assessment.',
      options: [
        { label: 'Virtual consultation',  icon: 'monitor',   action: { type: 'consult', mode: 'virtual' } },
        { label: 'In-person consultation', icon: 'building',  action: { type: 'consult', mode: 'in-person' } },
        { label: 'Back',                 icon: 'arrow-left', goto: 'consult_flow' },
      ],
    },

    // ─── Location ───
    location: {
      message: '<strong>Regus — Durban Country Club</strong><br>101 Isaiah Ntshangase Road<br>Stamford Hill, Durban 4001<br><br><strong>Mon – Fri:</strong> 08h00 – 16h30<br><strong>Weekends:</strong> By Appointment Only',
      options: [
        { label: 'Open in Google Maps',  icon: 'map',             action: { type: 'maps' } },
        { label: 'Call for directions',   icon: 'phone',           action: { type: 'call' } },
        { label: 'WhatsApp us',          icon: 'message-circle',  action: { type: 'whatsapp', text: 'Hello, I would like directions to your Durban office.' } },
        { label: 'Back to main menu',    icon: 'arrow-left',      goto: 'root' },
      ],
    },

    // ─── Contact Info ───
    contact_info: {
      message: '<strong>Operating Hours</strong><br>Monday – Friday: 08h00 – 16h30<br>Weekends: By Appointment Only<br><br>Reach us through any of these channels:',
      options: [
        { label: 'Call now',             icon: 'phone',           action: { type: 'call' } },
        { label: 'Email us',            icon: 'mail',            action: { type: 'email' } },
        { label: 'WhatsApp us',         icon: 'message-circle',  action: { type: 'whatsapp', text: 'Hello, I would like to enquire about your legal services.' } },
        { label: 'Visit contact page',  icon: 'external-link',   action: { type: 'page', url: 'contact.html' } },
        { label: 'Back to main menu',   icon: 'arrow-left',      goto: 'root' },
      ],
    },

    // ─── About ───
    about: {
      message: '<strong>Sethu Mkhwanazi Attorneys Inc.</strong> is a Durban-based legal practice founded by Siphosethu Mkhwanazi, providing effective legal solutions for businesses and individuals across South Africa.',
      options: [
        { label: 'Read more about us',  icon: 'book-open',       action: { type: 'page', url: 'about.html' } },
        { label: 'View all services',   icon: 'briefcase',       action: { type: 'page', url: 'services/index.html' } },
        { label: 'Book consultation',   icon: 'calendar',        action: { type: 'consult' } },
        { label: 'Back to main menu',   icon: 'arrow-left',      goto: 'root' },
      ],
    },
  };

  // Breadcrumb-friendly labels for each node
  const NODE_LABELS = {
    root: 'Menu',
    legal_help: 'Legal Help',
    civil: 'Civil Litigation',
    corporate: 'Corporate Law',
    labour: 'Labour Law',
    family: 'Family Law',
    estate: 'Estate Planning',
    not_sure: 'Other',
    consult_flow: 'Consultation',
    consult_info: 'Formats',
    location: 'Location',
    contact_info: 'Contact',
    about: 'About',
  };


  // ─── Navigator Engine ──────────────────────────────────────────
  function initNavigator() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotOptions = document.getElementById('chatbot-options');
    const chatbotBreadcrumb = document.getElementById('chatbot-breadcrumb');
    const chatbotHomeBtn = document.getElementById('chatbot-home');

    if (!chatbotToggle || !chatbotWindow) return;

    let isOpen = false;
    let history = []; // stack of node IDs for back navigation
    let currentNode = null;

    // ── Toggle ──
    function toggleChat(forceState) {
      if (forceState !== undefined && forceState !== null) {
        isOpen = forceState;
      } else {
        isOpen = !isOpen;
      }

      if (isOpen) {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.classList.add('scale-0');
        chatbotWindow.classList.remove('translate-y-full', 'opacity-0', 'scale-95');
        // Initialize on first open
        if (!currentNode) {
          navigateTo('root', false);
        }
      } else {
        chatbotWindow.classList.add('translate-y-full', 'opacity-0', 'scale-95');
        chatbotToggle.classList.remove('scale-0');
        setTimeout(function () {
          chatbotWindow.classList.add('hidden');
        }, 300);
      }
    }

    chatbotToggle.addEventListener('click', function () { toggleChat(true); });
    chatbotClose.addEventListener('click', function () { toggleChat(false); });

    // ── Navigate to a node ──
    function navigateTo(nodeId, addToHistory) {
      if (addToHistory === undefined) addToHistory = true;
      var node = TREE[nodeId];
      if (!node) return;

      if (addToHistory && currentNode) {
        history.push(currentNode);
      }
      currentNode = nodeId;

      // Show typing indicator, then render
      showTyping(function () {
        renderMessage(node.message);
        renderOptions(node.options);
        renderBreadcrumb();
        refreshIcons();
      });
    }

    // ── Render the bot message ──
    function renderMessage(html) {
      chatbotMessages.innerHTML = '';
      var msgWrap = document.createElement('div');
      msgWrap.className = 'nav-message';

      var bubble = document.createElement('div');
      bubble.className = 'nav-bubble';
      bubble.innerHTML = html;

      msgWrap.appendChild(bubble);
      chatbotMessages.appendChild(msgWrap);
    }

    // ── Render option cards ──
    function renderOptions(options) {
      chatbotOptions.innerHTML = '';

      options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';

        // Determine if this is a back/navigation button vs an action card
        var isBack = opt.icon === 'arrow-left';
        var isAction = !!opt.action;

        if (isBack) {
          btn.className = 'nav-back-btn';
        } else if (isAction) {
          btn.className = 'nav-action-card';
        } else {
          btn.className = 'nav-option-card';
        }

        // Stagger animation
        btn.style.animationDelay = (idx * 0.06) + 's';

        // Build inner content
        var iconHtml = '<i data-lucide="' + opt.icon + '" class="nav-card-icon"></i>';
        var labelHtml = '<span class="nav-card-label">' + opt.label + '</span>';

        if (isBack) {
          btn.innerHTML = iconHtml + labelHtml;
        } else {
          var chevron = '<i data-lucide="chevron-right" class="nav-card-chevron"></i>';
          btn.innerHTML = '<span class="nav-card-left">' + iconHtml + labelHtml + '</span>' + chevron;
        }

        // Click handler
        btn.addEventListener('click', function () {
          if (opt.goto) {
            navigateTo(opt.goto);
          } else if (opt.action) {
            executeAction(opt.action);
          }
        });

        chatbotOptions.appendChild(btn);
      });
    }

    // ── Render breadcrumb ──
    function renderBreadcrumb() {
      if (!chatbotBreadcrumb) return;
      chatbotBreadcrumb.innerHTML = '';

      // Build path: history + current
      var path = history.concat([currentNode]);

      // Only show breadcrumb if deeper than root
      if (path.length <= 1) {
        chatbotBreadcrumb.style.display = 'none';
        if (chatbotHomeBtn) chatbotHomeBtn.style.display = 'none';
        return;
      }

      chatbotBreadcrumb.style.display = 'flex';
      if (chatbotHomeBtn) chatbotHomeBtn.style.display = 'flex';

      path.forEach(function (nodeId, i) {
        var label = NODE_LABELS[nodeId] || nodeId;
        var isLast = i === path.length - 1;

        if (i > 0) {
          var sep = document.createElement('span');
          sep.className = 'nav-breadcrumb-sep';
          sep.innerHTML = '<i data-lucide="chevron-right" class="w-3 h-3"></i>';
          chatbotBreadcrumb.appendChild(sep);
        }

        var crumb = document.createElement('span');
        if (isLast) {
          crumb.className = 'nav-breadcrumb-current';
          crumb.textContent = label;
        } else {
          crumb.className = 'nav-breadcrumb-link';
          crumb.textContent = label;
          // Click to jump back to that point in history
          (function (targetIdx) {
            crumb.addEventListener('click', function () {
              var targetId = path[targetIdx];
              // Trim history to that point
              history = path.slice(0, targetIdx);
              currentNode = null;
              navigateTo(targetId, false);
            });
          })(i);
        }
        chatbotBreadcrumb.appendChild(crumb);
      });
    }

    // ── Typing indicator ──
    function showTyping(callback) {
      chatbotOptions.innerHTML = '';
      chatbotMessages.innerHTML = '';

      var typingDiv = document.createElement('div');
      typingDiv.className = 'nav-message';
      typingDiv.innerHTML = '<div class="nav-typing"><span></span><span></span><span></span></div>';
      chatbotMessages.appendChild(typingDiv);

      setTimeout(function () {
        callback();
      }, 450 + Math.random() * 250);
    }

    // ── Execute real-world actions ──
    function executeAction(action) {
      switch (action.type) {
        case 'page':
          window.location.href = action.url;
          break;

        case 'whatsapp':
          var waText = encodeURIComponent(action.text || 'Hello, I would like to enquire about your legal services.');
          window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText, '_blank');
          break;

        case 'call':
          window.location.href = 'tel:' + PHONE_NUMBER;
          break;

        case 'email':
          window.location.href = 'mailto:' + EMAIL;
          break;

        case 'maps':
          window.open(MAPS_URL, '_blank');
          break;

        case 'consult':
          var params = [];
          if (action.area) params.push('area=' + encodeURIComponent(action.area));
          if (action.mode) params.push('mode=' + encodeURIComponent(action.mode));
          var qs = params.length > 0 ? '?' + params.join('&') : '';
          window.location.href = 'book-consultation.html' + qs;
          break;
      }
    }

    // ── Home button handler ──
    if (chatbotHomeBtn) {
      chatbotHomeBtn.addEventListener('click', function () {
        history = [];
        currentNode = null;
        navigateTo('root', false);
      });
    }

    // ── Refresh Lucide icons ──
    function refreshIcons() {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        setTimeout(function () {
          window.lucide.createIcons();
        }, 10);
      }
    }
  }

  // ── Initialize ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigator);
  } else {
    initNavigator();
  }
})();
