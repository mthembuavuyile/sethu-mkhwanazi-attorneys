/**
 * Sethu Mkhwanazi Attorneys Inc.
 * Rule-Based Chatbot Logic
 */

(function () {
  'use strict';

  function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotQuickReplies = document.getElementById('chatbot-quick-replies');

    if (!chatbotToggle || !chatbotWindow) return;

    let isOpen = false;

    // Toggle Chat Window
    function toggleChat(forceState = null) {
      if (forceState !== null) {
        isOpen = forceState;
      } else {
        isOpen = !isOpen;
      }

      if (isOpen) {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.classList.add('scale-0'); // Hide toggle button
        chatbotWindow.classList.remove('translate-y-full', 'opacity-0', 'scale-95');
        setTimeout(() => {
          chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 50);
      } else {
        chatbotWindow.classList.add('translate-y-full', 'opacity-0', 'scale-95');
        chatbotToggle.classList.remove('scale-0'); // Show toggle button
        setTimeout(() => {
          chatbotWindow.classList.add('hidden');
        }, 300); // Wait for transition
      }
    }

    chatbotToggle.addEventListener('click', () => toggleChat(true));
    chatbotClose.addEventListener('click', () => toggleChat(false));

    // Message Rendering
    function appendMessage(sender, text, isHtml = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex w-full mb-3 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

      const bubble = document.createElement('div');
      bubble.className = `max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
        sender === 'user' 
        ? 'bg-accent text-accent-foreground rounded-br-none' 
        : 'bg-muted/80 text-foreground rounded-bl-none border border-border/50'
      }`;
      
      if (isHtml) {
        bubble.innerHTML = text;
      } else {
        bubble.textContent = text;
      }

      msgDiv.appendChild(bubble);
      chatbotMessages.appendChild(msgDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'chatbot-typing';
      typingDiv.className = 'flex w-full mb-3 justify-start';
      typingDiv.innerHTML = `
        <div class="bg-muted/80 text-foreground rounded-2xl rounded-bl-none px-4 py-3 border border-border/50 flex space-x-1.5 items-center h-[38px]">
          <div class="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></div>
        </div>
      `;
      chatbotMessages.appendChild(typingDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
      const typingDiv = document.getElementById('chatbot-typing');
      if (typingDiv) {
        typingDiv.remove();
      }
    }

    // Bot Response Logic
    function respondTo(query, callback) {
      showTypingIndicator();
      chatbotQuickReplies.innerHTML = ''; // Clear quick replies while thinking
      
      setTimeout(() => {
        removeTypingIndicator();
        let responseHTML = '';
        let newQuickReplies = [];

        const lowerQuery = query.toLowerCase();

        // Rules
        if (lowerQuery.includes('consultation') || lowerQuery.includes('book') || lowerQuery.includes('appointment') || lowerQuery.includes('fee')) {
          responseHTML = 'We offer comprehensive legal consultations. Please book a session to discuss your matter with our team.<br><br><a href="book-consultation.html" class="inline-block mt-2 px-3 py-1 bg-accent/20 text-accent rounded-md hover:bg-accent/30 font-medium">Book a Consultation</a>';
          newQuickReplies = ['Practice Areas', 'Contact Info'];
        } 
        else if (lowerQuery.includes('services') || lowerQuery.includes('practice areas') || lowerQuery.includes('what do you do') || lowerQuery.includes('help with')) {
          responseHTML = 'We specialize in several areas of law:<ul class="list-disc ml-4 mt-2 space-y-1"><li>Civil & Commercial Litigation</li><li>Corporate & Commercial Law</li><li>Labour & Employment Law</li><li>Family & Matrimonial Law</li><li>Estate Planning & Wills</li></ul><br><a href="services/index.html" class="text-accent hover:underline font-medium">View all services &rarr;</a>';
          newQuickReplies = ['Book Consultation', 'Office Hours'];
        }
        else if (lowerQuery.includes('hours') || lowerQuery.includes('time') || lowerQuery.includes('open') || lowerQuery.includes('when')) {
          responseHTML = 'Our operating hours are:<br><strong>Monday - Friday:</strong> 08h00 - 16h30<br><strong>Weekends:</strong> By Appointment Only';
          newQuickReplies = ['Location', 'Book Consultation'];
        }
        else if (lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('where') || lowerQuery.includes('office')) {
          responseHTML = 'We are located at:<br><strong>Regus - Durban Country Club</strong><br>101 Isaiah Ntshangase Road<br>Stamford Hill, Durban 4001<br><br><a href="https://www.google.com/maps/search/?api=1&query=Regus+Durban+Country+Club+101+Isaiah+Ntshangase+Road+Stamford+Hill+Durban" target="_blank" class="inline-flex items-center mt-2 px-3 py-1.5 bg-accent/20 text-accent rounded-md hover:bg-accent/30 font-medium text-xs transition-colors"><i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1.5"></i> Open in Google Maps</a>';
          newQuickReplies = ['Contact Info', 'Office Hours'];
        }
        else if (lowerQuery.includes('contact') || lowerQuery.includes('human') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('speak')) {
          responseHTML = 'You can reach our team directly at:<br><span class="inline-flex items-center gap-1.5 mt-2"><i data-lucide="phone" class="w-4 h-4 text-accent"></i> <a href="tel:0310076324" class="text-accent hover:underline font-medium">031 007 6324</a></span><br><span class="inline-flex items-center gap-1.5 mt-1.5"><i data-lucide="mail" class="w-4 h-4 text-accent"></i> <a href="mailto:info@sethumkhwanaziattorneys.co.za" class="text-accent hover:underline font-medium">Email Us</a></span><br><span class="inline-flex items-center gap-1.5 mt-1.5"><i data-lucide="message-circle" class="w-4 h-4 text-accent"></i> <a href="https://wa.me/27825945643" target="_blank" class="text-accent hover:underline font-medium">Chat on WhatsApp</a></span>';
          newQuickReplies = ['Book Consultation', 'Location'];
        }
        else if (lowerQuery.includes('hello') || lowerQuery.includes('hi ') || lowerQuery === 'hi') {
          responseHTML = 'Hello! How can I assist you today? Please choose an option below or type your question.';
          newQuickReplies = ['Book Consultation', 'Practice Areas', 'Contact Info'];
        }
        else {
          responseHTML = "I'm a virtual assistant and I'm not sure how to answer that specific query. Would you like to speak to a human or view our services?";
          newQuickReplies = ['Speak to a Human', 'Practice Areas', 'Book Consultation'];
        }

        appendMessage('bot', responseHTML, true);
        renderQuickReplies(newQuickReplies);
        
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
        
        if (callback) callback();
      }, 800 + Math.random() * 500); // Simulate thinking time
    }

    function renderQuickReplies(replies) {
      chatbotQuickReplies.innerHTML = '';
      replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'text-xs whitespace-nowrap px-3 py-1.5 rounded-full border border-accent/40 bg-accent/5 text-accent hover:bg-accent/15 transition-colors focus:outline-none focus:ring-1 focus:ring-accent';
        btn.textContent = reply;
        btn.addEventListener('click', () => {
          handleUserSubmission(reply);
        });
        chatbotQuickReplies.appendChild(btn);
      });
      // Scroll to bottom after adding quick replies
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function handleUserSubmission(text) {
      if (!text.trim()) return;
      
      appendMessage('user', text);
      respondTo(text);
    }

    // Initial greeting if not yet initialized
    setTimeout(() => {
      if (chatbotMessages.children.length === 0) {
        appendMessage('bot', 'Welcome to Sethu Mkhwanazi Attorneys Inc. How can we assist you today?', true);
        renderQuickReplies(['Book Consultation', 'Practice Areas', 'Office Hours', 'Speak to a Human']);
      }
    }, 500);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
