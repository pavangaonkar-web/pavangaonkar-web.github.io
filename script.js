// DOM elements
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCanvas();
    initParticles();
    animate();
    
    // Show the initial section (about)
    showSection('about');
});

// Handle navigation clicks
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
            updateActiveNav(sectionId);
        });
    });
}

// Show selected section and hide others
function showSection(id) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update URL hash without scrolling
    history.pushState(null, null, `#${id}`);
    
    // Update navigation
    updateActiveNav(id);
}

// Update active navigation link
function updateActiveNav(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Particle class for background animation
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(100, 255, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.5 + 0.1})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Setup canvas size
function setupCanvas() {
    // Set canvas size initially
    setCanvasSize();
    
    // Update canvas size on window resize
    window.addEventListener('resize', () => {
        setCanvasSize();
        initParticles(); // Reinitialize particles when canvas size changes
    });
}

// Set canvas dimensions
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Particles array
let particles = [];

// Initialize particles based on screen size
function initParticles() {
    particles = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Continue animation loop
    requestAnimationFrame(animate);
}

// Handle hash changes to navigate to proper section
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Check URL hash on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});
// Function to handle smooth section transitions
function handleSectionTransitions() {
  const sections = document.querySelectorAll('.section');
  
  // Initialize Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add 'visible' class when section is in viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  handleSectionTransitions();
});

// You likely already have code for handling nav clicks, but ensure it's smooth
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    // Smooth scroll to the section
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});
