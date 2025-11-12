/**
 * Sticky Header with Collapse on Scroll
 * Toggles navbar-collapsed class after scrolling 80px
 * Enhances blur and backdrop filter when collapsed
 */

(function() {
  'use strict';

  // Get the navbar element
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) {
    return; // Exit if navbar doesn't exist
  }

  // Scroll threshold (80px)
  const SCROLL_THRESHOLD = 80;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Function to handle scroll
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY > SCROLL_THRESHOLD) {
      // Add collapsed class
      if (!navbar.classList.contains('navbar-collapsed')) {
        navbar.classList.add('navbar-collapsed');
      }
    } else {
      // Remove collapsed class
      if (navbar.classList.contains('navbar-collapsed')) {
        navbar.classList.remove('navbar-collapsed');
      }
    }
  }

  // Throttle function for performance
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

  // Create throttled scroll handler (runs max once per 10ms)
  const throttledHandleScroll = throttle(handleScroll, 10);

  // Initialize on page load
  function init() {
    // Check initial scroll position
    handleScroll();
    
    // Add scroll event listener
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    } else {
      // For reduced motion, just check once
      handleScroll();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();

