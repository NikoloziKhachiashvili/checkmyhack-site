/**
 * Social Links Configuration
 * Easy way to update social media links across the site
 * 
 * To update links, modify the SOCIAL_LINKS object below.
 * The script will automatically update all social icons with matching data-social attributes.
 */

(function() {
  'use strict';

  // Social media links configuration
  // Update these values to change links site-wide
  const SOCIAL_LINKS = {
    linkedin: 'https://www.linkedin.com/in/nikoloz-khachiashvili',
    github: 'https://github.com/NikoloziKhachiashvili',
    tiktok: 'https://www.tiktok.com/@xarchoiaa'
  };

  // Function to update all social links
  function updateSocialLinks() {
    Object.keys(SOCIAL_LINKS).forEach(function(platform) {
      const links = document.querySelectorAll(`a.social-icon[data-social="${platform}"]`);
      links.forEach(function(link) {
        link.href = SOCIAL_LINKS[platform];
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSocialLinks);
  } else {
    // DOM already loaded
    updateSocialLinks();
  }

})();

