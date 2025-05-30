// DOM Elements 
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const revealTexts = document.querySelectorAll('.reveal-text');
const cvIframe = document.getElementById('cv-iframe');
const cvLoading = document.getElementById('cv-loading');
const currentYearElement = document.getElementById('current-year');

// State management
const state = {
  // Track which sections have been viewed (to prevent re-animation)
  visitedSections: new Set(['about']), // Start with about as visited
  // Track current active section  
  currentSection: 'about',
  // Flag to prevent rapid section switching
  isTransitioning: false
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  currentYearElement.textContent = new Date().getFullYear();
  
  // Set up navigation click listeners
  setupNavigation();
  
  // Initialize CV section
  setupCVSection();
  
  // Start the initial text reveal animation for the about section
  revealAboutText();
  
  // Check screen size and adjust as needed
  adjustForMobileScreens();
  
  // Setup section animations
  setupSectionAnimations();
  
  // Initialize AOS library
  initAOS();
  
  // Listen for window resize events
  window.addEventListener('resize', adjustForMobileScreens);
});

// Initialize AOS (Animate On Scroll) library
function initAOS() {
  // Check if AOS is loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
}

// Handle mobile-specific adjustments
function adjustForMobileScreens() {
  if (window.innerWidth <= 768) {
    // Mobile-specific adjustments here
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, {passive: true});
      
      link.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, {passive: true});
    });
  }
}

// Handle navigation between sections
function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get section ID from data attribute
      const sectionId = link.getAttribute('data-section');
      
      // Don't do anything if we're already on this section or transitioning
      if (sectionId === state.currentSection || state.isTransitioning) {
        return;
      }
      
      // Update active link with animated underline effect
      updateActiveNavLink(sectionId);
      
      // Show the selected section with enhanced smooth transition
      switchToSection(sectionId);
    });
  });
}

// Update active navigation link with animated underline
function updateActiveNavLink(sectionId) {
  navLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
      // Add pulse animation to active link
      link.classList.add('pulse-animation');
      setTimeout(() => {
        link.classList.remove('pulse-animation');
      }, 500);
    } else {
      link.classList.remove('active');
    }
  });
}

// Handle section switching with enhanced smooth transitions
function switchToSection(sectionId) {
  // Set transitioning flag to prevent rapid clicking
  state.isTransitioning = true;
  
  // Get current and target sections
  const currentSectionElement = document.getElementById(state.currentSection);
  const targetSectionElement = document.getElementById(sectionId);
  
  // Add slide-out class to current section
  currentSectionElement.classList.add('slide-out');
  
  // Wait for slide out before showing new section
  setTimeout(() => {
    // Hide current section
    currentSectionElement.classList.remove('active');
    currentSectionElement.classList.remove('slide-out');
    
    // Show target section but with initial state for animation
    targetSectionElement.classList.add('active');
    targetSectionElement.classList.add('slide-in');
    
    // Force browser to recognize the change
    void targetSectionElement.offsetWidth;
    
    // Trigger section-specific animations
    animateSection(sectionId);
    
    // Remove slide-in class after animation completes
    setTimeout(() => {
      targetSectionElement.classList.remove('slide-in');
    }, 500);
    
    // Scroll to top of the new section on mobile
    if (window.innerWidth <= 768) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Update state
    state.currentSection = sectionId;
    
    // If this is the first time viewing this section and it's the about section,
    // trigger the reveal animation
    if (!state.visitedSections.has(sectionId) && sectionId === 'about') {
      revealAboutText();
    }
    
    // Add this section to visited sections
    state.visitedSections.add(sectionId);
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      state.isTransitioning = false;
    }, 600); // Match the CSS transition time
    
  }, 300); // Slightly shorter than the CSS transition time
}

// Setup initial animations for section elements
function setupSectionAnimations() {
  // Add animation classes to elements
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.classList.add('animate-on-enter');
    card.style.animationDelay = `${index * 0.1}s`;
  });
  
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach((card, index) => {
    card.classList.add('animate-on-enter');
    card.style.animationDelay = `${index * 0.1}s`;
  });
  
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach((item, index) => {
    item.classList.add('animate-on-enter');
    item.style.animationDelay = `${index * 0.1}s`;
  });
}

// Trigger animations specific to each section
function animateSection(sectionId) {
  const section = document.getElementById(sectionId);
  
  // Reset animations
  section.querySelectorAll('.animate-on-enter').forEach(el => {
    el.classList.remove('animated');
    void el.offsetWidth; // Force reflow
    el.classList.add('animated');
  });
  
  // Section-specific animations
  switch(sectionId) {
    case 'about':
      // Handle profile image animation
      const profileImg = section.querySelector('.profile-img-container');
      if (profileImg) {
        profileImg.classList.add('bounce-in');
        setTimeout(() => {
          profileImg.classList.remove('bounce-in');
        }, 1000);
      }
      // Reveal text paragraphs with staggered timing
      if (!state.visitedSections.has('about')) {
        revealAboutText();
      }
      break;
      
    case 'cv':
      // Animate CV buttons
      const cvButtons = section.querySelectorAll('.btn');
      cvButtons.forEach((btn, index) => {
        btn.classList.add('pop-in');
        btn.style.animationDelay = `${index * 0.2}s`;
        setTimeout(() => {
          btn.classList.remove('pop-in');
        }, 1000);
      });
      
      // Enhanced CV preview animation
      const cvPreview = section.querySelector('.cv-preview');
      if (cvPreview) {
        cvPreview.classList.add('fade-scale-in');
        setTimeout(() => {
          cvPreview.classList.remove('fade-scale-in');
        }, 1000);
      }
      break;
      
    case 'projects':
    case 'blog':
      // Cards will animate via their animate-on-enter class
      break;
      
    case 'contact':
      // Contact info items will animate via their animate-on-enter class
      // Add special animation for LinkedIn button
      const linkedinBtn = section.querySelector('.linkedin-btn');
      if (linkedinBtn) {
        linkedinBtn.classList.add('pulse-animation');
        setTimeout(() => {
          linkedinBtn.classList.remove('pulse-animation');
        }, 1000);
      }
      break;
  }
}

// Handle text reveal animation for the about section
function revealAboutText() {
  // Exit if about section has already been visited and animation completed
  if (state.visitedSections.has('about') && document.querySelector('.reveal-text.visible')) {
    return;
  }
  
  // Trigger enhanced sequential animation for each paragraph
  revealTexts.forEach((text, index) => {
    setTimeout(() => {
      text.classList.add('visible');
      text.classList.add('highlight-reveal');
      setTimeout(() => {
        text.classList.remove('highlight-reveal');
      }, 800);
    }, 200 * index); // Stagger the animations
  });
}

// Set up CV section functionality with enhanced loading animation
function setupCVSection() {
  if (!cvIframe) return;
  
  // Handle CV iframe loading
  cvIframe.addEventListener('load', () => {
    if (cvLoading) {
      // Enhanced loading animation
      cvLoading.classList.add('fade-out');
      setTimeout(() => {
        cvLoading.style.display = 'none';
      }, 500);
    }
    
    // Add entrance animation to CV iframe
    cvIframe.classList.add('fade-in');
  });
  
  // Handle iframe errors
  cvIframe.addEventListener('error', () => {
    handleCVLoadError();
  });
  
  // Set a timeout in case the PDF doesn't load
  setTimeout(() => {
    if (cvLoading && cvLoading.style.display !== 'none') {
      handleCVLoadError();
    }
  }, 5000);
  
  // Add hover effect to CV frame
  const cvFrame = document.querySelector('.cv-frame');
  if (cvFrame) {
    cvFrame.addEventListener('mouseenter', () => {
      cvFrame.classList.add('hover-glow');
    });
    
    cvFrame.addEventListener('mouseleave', () => {
      cvFrame.classList.remove('hover-glow');
    });
  }
}

// Handle CV loading errors with enhanced fallback animation
function handleCVLoadError() {
  if (cvLoading) {
    cvLoading.classList.add('fade-out');
    setTimeout(() => {
      cvLoading.style.display = 'none';
    }, 500);
  }
  
  // Show fallback message with animation
  const cvFallback = document.querySelector('.cv-fallback');
  if (cvFallback) {
    cvFallback.style.display = 'flex';
    cvFallback.classList.add('fade-scale-in');
    setTimeout(() => {
      cvFallback.classList.remove('fade-scale-in');
    }, 1000);
  }
  
  // Hide iframe
  const cvFrame = document.querySelector('.cv-frame');
  if (cvFrame) {
    cvFrame.style.display = 'none';
  }
}
// Support for hash-based navigation
function handleURLHash() {
  const hash = window.location.hash;
  if (hash) {
    const sectionId = hash.substring(1); // Remove the # character
    const validSections = Array.from(sections).map(section => section.id);
    
    if (validSections.includes(sectionId)) {
      updateActiveNavLink(sectionId);
      switchToSection(sectionId);
    }
  }
}

// Check for URL hash on page load
window.addEventListener('load', handleURLHash);

// Listen for hash changes
window.addEventListener('hashchange', handleURLHash);

// Fix for mobile scrolling issue
window.addEventListener('load', function() {
  document.body.style.minHeight = '100vh';
  document.querySelector('.content').style.minHeight = 'auto';
});
