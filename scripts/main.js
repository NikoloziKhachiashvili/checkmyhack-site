/**
 * Main JavaScript - Lightweight and Non-Blocking
 * Handles:
 * - Mobile nav toggle
 * - Sticky header scroll behavior
 * - Smooth anchors with scrollBehavior
 * - Contact form client validation + toast
 * 
 * All scripts are deferred to prevent blocking first paint
 */

(function() {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Throttle function for performance optimization
   */
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Check if element exists
   */
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  /**
   * Check for reduced motion preference
   */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================

  function initMobileNavToggle() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebarMenu = document.querySelector('#sidebarMenu');
    
    if (!navbarToggler || !sidebarMenu) {
      return;
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 768) {
        const isClickInside = sidebarMenu.contains(e.target) || navbarToggler.contains(e.target);
        const isSidebarOpen = !sidebarMenu.classList.contains('collapse');
        
        if (!isClickInside && isSidebarOpen) {
          const bsCollapse = bootstrap.Collapse.getInstance(sidebarMenu);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      }
    });

    // Close sidebar when clicking on nav links (mobile only)
    const navLinks = sidebarMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth < 768) {
          const bsCollapse = bootstrap.Collapse.getInstance(sidebarMenu);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  // ============================================
  // STICKY HEADER SCROLL BEHAVIOR
  // ============================================

  function initStickyHeader() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) {
      return;
    }

    const SCROLL_THRESHOLD = 80;

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('navbar-collapsed');
      } else {
        navbar.classList.remove('navbar-collapsed');
      }
    }

    // Throttled scroll handler (runs max once per 10ms)
    const throttledHandleScroll = throttle(handleScroll, 10);

    // Check initial scroll position
    handleScroll();
    
    // Add scroll event listener
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    }
  }

  // ============================================
  // SMOOTH ANCHORS WITH SCROLL BEHAVIOR
  // ============================================

  function initSmoothAnchors() {
    // Set CSS scroll-behavior as fallback
    if (!prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Handle anchor links with JavaScript for better control
    document.addEventListener('click', function(e) {
      const anchor = e.target.closest('a[href^="#"]');
      
      if (!anchor || anchor.getAttribute('href') === '#') {
        return;
      }

      const targetId = anchor.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  }

  // ============================================
  // CONTACT FORM VALIDATION + TOAST
  // ============================================

  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
      return;
    }

    // Create toast container if it doesn't exist
    function createToastContainer() {
      let toastContainer = document.querySelector('.toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
      }
      return toastContainer;
    }

    // Show toast notification
    function showToast(type, message, title) {
      const toastContainer = createToastContainer();
      
      const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
      const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
      
      const toastHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="5000">
          <div class="toast-header ${bgClass} text-white">
            <i class="${icon} me-2"></i>
            <strong class="me-auto">${title || (type === 'success' ? 'Success!' : 'Error')}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${message}
          </div>
        </div>
      `;
      
      toastContainer.innerHTML = toastHTML;
      
      // Auto-remove after 5 seconds
      setTimeout(function() {
        const toast = toastContainer.querySelector('.toast');
        if (toast) {
          const bsToast = bootstrap.Toast.getInstance(toast) || new bootstrap.Toast(toast);
          bsToast.hide();
          setTimeout(function() {
            toast.remove();
          }, 300);
        }
      }, 5000);
    }

    // Validate email format
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Validate form
    function validateForm() {
      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const messageInput = contactForm.querySelector('#contact-message');
      
      if (!nameInput || !emailInput || !messageInput) {
        return false;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      let isValid = true;
      
      // Reset previous validation states
      contactForm.classList.remove('was-validated');
      const inputs = contactForm.querySelectorAll('.form-control');
      inputs.forEach(function(input) {
        input.classList.remove('is-invalid', 'is-valid');
      });
      
      // Validate name
      if (name === '') {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else if (name.length < 2) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.add('is-valid');
      }
      
      // Validate email
      if (email === '') {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else if (!isValidEmail(email)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.add('is-valid');
      }
      
      // Validate message
      if (message === '') {
        messageInput.classList.add('is-invalid');
        isValid = false;
      } else if (message.length < 10) {
        messageInput.classList.add('is-invalid');
        const messageFeedback = messageInput.nextElementSibling;
        if (messageFeedback && messageFeedback.classList.contains('invalid-feedback')) {
          messageFeedback.textContent = 'Message must be at least 10 characters long.';
        }
        isValid = false;
      } else {
        messageInput.classList.add('is-valid');
      }
      
      return isValid;
    }

    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Add Bootstrap validation classes
      contactForm.classList.add('was-validated');
      
      // Validate form
      if (validateForm()) {
        // Form is valid - show success toast
        showToast('success', 'Your message has been sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(function(input) {
          input.classList.remove('is-invalid', 'is-valid');
        });
        
        // In a real application, you would send the form data to a server here
        // Example: fetch('/api/contact', { method: 'POST', body: formData })
      } else {
        // Show error toast if validation fails
        showToast('error', 'Please correct the errors in the form before submitting.');
      }
    });

    // Real-time validation on blur
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        if (contactForm.classList.contains('was-validated')) {
          validateForm();
        }
      });
    });
  }

  // ============================================
  // LEARNING PROGRESS & WORKSHOP ENGAGEMENT
  // ============================================

  function initProgressAnimations() {
    // Animate progress bars on scroll into view
    const progressBars = document.querySelectorAll('.progress-bar[role="progressbar"]');
    
    if (progressBars.length === 0) {
      return;
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const progressObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute('aria-valuenow');
          
          // Animate progress bar
          setTimeout(function() {
            progressBar.style.transition = 'width 1s ease-out';
            progressBar.style.width = targetWidth + '%';
          }, 100);
          
          // Stop observing once animated
          progressObserver.unobserve(progressBar);
        }
      });
    }, observerOptions);

    // Observe all progress bars
    progressBars.forEach(function(bar) {
      progressObserver.observe(bar);
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Initialize all features
    initMobileNavToggle();
    initStickyHeader();
    initSmoothAnchors();
    initContactForm();
    initProgressAnimations();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();

