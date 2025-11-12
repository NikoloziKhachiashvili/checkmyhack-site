/**
 * Lightweight Scroll Animation System
 * Uses Intersection Observer API for performant scroll-triggered animations
 * Respects prefers-reduced-motion preference
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion, skip animations
  if (prefersReducedMotion) {
    // Make all animate-on-scroll elements visible immediately
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      el.classList.add('animate-visible');
    });
    return;
  }

  // Intersection Observer options
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -50px 0px', // trigger when element is 50px from bottom of viewport
    threshold: 0.1 // trigger when 10% of element is visible
  };

  // Create Intersection Observer
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Initialize animations when DOM is ready
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    // DOM already loaded
    initScrollAnimations();
  }

})();

