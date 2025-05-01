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
});

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
      
      // Update active link
      updateActiveNavLink(sectionId);
      
      // Show the selected section with smooth transition
      switchToSection(sectionId);
    });
  });
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
  navLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Handle section switching with smooth transitions
function switchToSection(sectionId) {
  // Set transitioning flag to prevent rapid clicking
  state.isTransitioning = true;
  
  // Get current and target sections
  const currentSectionElement = document.getElementById(state.currentSection);
  const targetSectionElement = document.getElementById(sectionId);
  
  // Fade out current section
  currentSectionElement.style.opacity = '0';
  
  // Wait for fade out before showing new section
  setTimeout(() => {
    // Hide current section
    currentSectionElement.classList.remove('active');
    
    // Show target section but with opacity 0
    targetSectionElement.classList.add('active');
    targetSectionElement.style.opacity = '0';
    
    // Force browser to recognize the change
    // This prevents layout thrashing
    void targetSectionElement.offsetWidth;
    
    // Fade in the target section
    targetSectionElement.style.opacity = '1';
    
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
    }, 400); // Match the CSS transition time
    
  }, 300); // Slightly shorter than the CSS transition time
}

// Handle text reveal animation for the about section
function revealAboutText() {
  // Exit if about section has already been visited
  if (state.visitedSections.has('about') && document.querySelector('.reveal-text.visible')) {
    return;
  }
  
  // Trigger sequential animation for each paragraph
  revealTexts.forEach((text, index) => {
    setTimeout(() => {
      text.classList.add('visible');
    }, 200 * index); // Stagger the animations
  });
}

// Set up CV section functionality
function setupCVSection() {
  if (!cvIframe) return;
  
  // Handle CV iframe loading
  cvIframe.addEventListener('load', () => {
    if (cvLoading) {
      // Hide loading spinner when iframe is loaded
      cvLoading.style.opacity = '0';
      setTimeout(() => {
        cvLoading.style.display = 'none';
      }, 300);
    }
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
}

// Handle CV loading errors
function handleCVLoadError() {
  if (cvLoading) {
    cvLoading.style.display = 'none';
  }
  
  // Show fallback message
  const cvFallback = document.querySelector('.cv-fallback');
  if (cvFallback) {
    cvFallback.style.display = 'flex';
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
