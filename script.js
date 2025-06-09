// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const revealTexts = document.querySelectorAll('.reveal-text');
const cvIframe = document.getElementById('cv-iframe');
const cvLoading = document.getElementById('cv-loading');
const currentYearElement = document.getElementById('current-year');

// State
const state = {
  visitedSections: new Set(['about']),
  currentSection: 'about',
  isTransitioning: false
};

document.addEventListener('DOMContentLoaded', () => {
  currentYearElement.textContent = new Date().getFullYear();
  setupNavigation();
  setupCVSection();
  revealAboutText();
  adjustForMobileScreens();
  setupSectionAnimations();
  initAOS();
  window.addEventListener('resize', adjustForMobileScreens);
});

// AOS initialization
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
}

function adjustForMobileScreens() {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('touchstart', () => link.classList.add('touch-active'), { passive: true });
      link.addEventListener('touchend', () => link.classList.remove('touch-active'), { passive: true });
    });
  }
}

function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      if (sectionId === state.currentSection || state.isTransitioning) return;
      updateActiveNavLink(sectionId);
      switchToSection(sectionId);
    });
  });
}

function updateActiveNavLink(sectionId) {
  navLinks.forEach(link => {
    const match = link.getAttribute('data-section') === sectionId;
    link.classList.toggle('active', match);
    if (match) {
      link.classList.add('pulse-animation');
      setTimeout(() => link.classList.remove('pulse-animation'), 500);
    }
  });
}

function switchToSection(sectionId) {
  state.isTransitioning = true;

  const current = document.getElementById(state.currentSection);
  const target = document.getElementById(sectionId);

  current.classList.add('slide-out');

  setTimeout(() => {
    current.classList.remove('active', 'slide-out');
    target.classList.add('active', 'slide-in');
    void target.offsetWidth;

    animateSection(sectionId);

    setTimeout(() => target.classList.remove('slide-in'), 500);

    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    state.currentSection = sectionId;

    if (!state.visitedSections.has(sectionId) && sectionId === 'about') {
      revealAboutText();
    }

    state.visitedSections.add(sectionId);

    setTimeout(() => (state.isTransitioning = false), 600);
  }, 300);
}

function setupSectionAnimations() {
  const animateStagger = (elements) => {
    elements.forEach((el, idx) => {
      el.classList.add('animate-on-enter');
      el.style.animationDelay = `${idx * 0.1}s`;
    });
  };

  animateStagger(document.querySelectorAll('.project-card'));
  animateStagger(document.querySelectorAll('.blog-card'));
  animateStagger(document.querySelectorAll('.contact-item'));
}

function animateSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.querySelectorAll('.animate-on-enter').forEach(el => {
    el.classList.remove('animated');
    void el.offsetWidth;
    el.classList.add('animated');
  });

  switch (sectionId) {
    case 'about':
      const profile = section.querySelector('.profile-img-container');
      if (profile) {
        profile.classList.add('bounce-in');
        setTimeout(() => profile.classList.remove('bounce-in'), 1000);
      }
      if (!state.visitedSections.has('about')) revealAboutText();
      break;
    case 'cv':
      section.querySelectorAll('.btn').forEach((btn, idx) => {
        btn.classList.add('pop-in');
        btn.style.animationDelay = `${idx * 0.2}s`;
        setTimeout(() => btn.classList.remove('pop-in'), 1000);
      });
      const preview = section.querySelector('.cv-preview');
      if (preview) {
        preview.classList.add('fade-scale-in');
        setTimeout(() => preview.classList.remove('fade-scale-in'), 1000);
      }
      break;
    case 'contact':
      const linkedinBtn = section.querySelector('.linkedin-btn');
      if (linkedinBtn) {
        linkedinBtn.classList.add('pulse-animation');
        setTimeout(() => linkedinBtn.classList.remove('pulse-animation'), 1000);
      }
      break;
  }
}

function revealAboutText() {
  if (state.visitedSections.has('about') && document.querySelector('.reveal-text.visible')) return;

  revealTexts.forEach((text, i) => {
    setTimeout(() => {
      text.classList.add('visible', 'highlight-reveal');
      setTimeout(() => text.classList.remove('highlight-reveal'), 800);
    }, 200 * i);
  });
}

function setupCVSection() {
  if (!cvIframe) return;

  cvIframe.addEventListener('load', () => {
    if (cvLoading) {
      cvLoading.classList.add('fade-out');
      setTimeout(() => (cvLoading.style.display = 'none'), 500);
    }
    cvIframe.classList.add('fade-in');
  });

  cvIframe.addEventListener('error', handleCVLoadError);

  setTimeout(() => {
    if (cvLoading && cvLoading.style.display !== 'none') handleCVLoadError();
  }, 5000);

  const frame = document.querySelector('.cv-frame');
  if (frame) {
    frame.addEventListener('mouseenter', () => frame.classList.add('hover-glow'));
    frame.addEventListener('mouseleave', () => frame.classList.remove('hover-glow'));
  }
}

function handleCVLoadError() {
  if (cvLoading) {
    cvLoading.classList.add('fade-out');
    setTimeout(() => (cvLoading.style.display = 'none'), 500);
  }

  const fallback = document.querySelector('.cv-fallback');
  if (fallback) {
    fallback.style.display = 'flex';
    fallback.classList.add('fade-scale-in');
    setTimeout(() => fallback.classList.remove('fade-scale-in'), 1000);
  }

  const frame = document.querySelector('.cv-frame');
  if (frame) frame.style.display = 'none';
}

// Handle URL hash navigation
function handleURLHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const valid = Array.from(sections).map(s => s.id);
  if (valid.includes(hash)) {
    updateActiveNavLink(hash);
    switchToSection(hash);
  }
}

window.addEventListener('load', () => {
  handleURLHash();
  document.body.style.minHeight = '100vh';
  document.querySelector('.content').style.minHeight = 'auto';
});

window.addEventListener('hashchange', handleURLHash);
 
