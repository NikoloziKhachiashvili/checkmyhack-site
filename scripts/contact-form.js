/**
 * Contact Form Validation and Success Toast
 * Client-side validation with Bootstrap toast notification
 */

(function() {
  'use strict';

  // Get form element
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) {
    return; // Exit if form doesn't exist
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

  // Show success toast
  function showSuccessToast() {
    const toastContainer = createToastContainer();
    
    const toastHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="5000">
        <div class="toast-header bg-success text-white">
          <i class="bi-check-circle-fill me-2"></i>
          <strong class="me-auto">Success!</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Your message has been sent successfully! We'll get back to you soon.
        </div>
      </div>
    `;
    
    toastContainer.innerHTML = toastHTML;
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
      const toast = toastContainer.querySelector('.toast');
      if (toast) {
        const bsToast = new bootstrap.Toast(toast);
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
    const name = contactForm.querySelector('#contact-name').value.trim();
    const email = contactForm.querySelector('#contact-email').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();
    
    let isValid = true;
    
    // Reset previous validation states
    contactForm.classList.remove('was-validated');
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(function(input) {
      input.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate name
    if (name === '') {
      contactForm.querySelector('#contact-name').classList.add('is-invalid');
      isValid = false;
    } else {
      contactForm.querySelector('#contact-name').classList.add('is-valid');
    }
    
    // Validate email
    if (email === '' || !isValidEmail(email)) {
      contactForm.querySelector('#contact-email').classList.add('is-invalid');
      isValid = false;
    } else {
      contactForm.querySelector('#contact-email').classList.add('is-valid');
    }
    
    // Validate message
    if (message === '' || message.length < 10) {
      contactForm.querySelector('#contact-message').classList.add('is-invalid');
      const messageFeedback = contactForm.querySelector('#contact-message').nextElementSibling;
      if (messageFeedback) {
        messageFeedback.textContent = message === '' ? 'Please provide a message.' : 'Message must be at least 10 characters long.';
      }
      isValid = false;
    } else {
      contactForm.querySelector('#contact-message').classList.add('is-valid');
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
      showSuccessToast();
      
      // Reset form
      contactForm.reset();
      contactForm.classList.remove('was-validated');
      const inputs = contactForm.querySelectorAll('.form-control');
      inputs.forEach(function(input) {
        input.classList.remove('is-invalid', 'is-valid');
      });
      
      // In a real application, you would send the form data to a server here
      console.log('Form submitted successfully!', {
        name: contactForm.querySelector('#contact-name').value,
        email: contactForm.querySelector('#contact-email').value,
        message: contactForm.querySelector('#contact-message').value
      });
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

})();

