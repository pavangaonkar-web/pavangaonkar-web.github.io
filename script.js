// Main script for Pavan Gaonkar's portfolio website
'use strict';

// DOM elements
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const currentYearElement = document.getElementById('current-year');

// Global variables
let particles = [];
let mousePosition = { x: undefined, y: undefined };
let animationId = null;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCanvas();
    
    if (!isReducedMotion) {
        initParticles();
        animate();
    } else {
        // Simple static background for reduced motion preference
        drawStaticBackground();
    }
    
    // Update footer year
    currentYearElement.textContent = new Date().getFullYear();
    
    // Show the initial section (about)
    const hash = window.location.hash.substring(1);
    showSection(hash || 'about');
});

// Handle navigation clicks with smooth transitions
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            // First update the active navigation item
            updateActiveNav(sectionId);
            
            // Then show the section with animation
            showSection(sectionId);
            
            // Update URL without page jump
            history.pushState(null, null, `#${sectionId}`);
        });
    });
    
    // Add active class to nav links based on scroll position
    if (!isReducedMotion) {
        window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
    }
}

// Show selected section with smooth transition
function showSection(id) {
    // If id doesn't exist, default to about
    if (!document.getElementById(id)) {
        id = 'about';
    }
    
    // First transition out all sections
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Then show and transition in the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
        // Set display to block first
        selectedSection.style.display = 'block';
        
        // Force a reflow to ensure the transition will work
        selectedSection.offsetHeight;
        
        // Then add the active class for the animation
        setTimeout(() => {
            selectedSection.classList.add('active');
        }, 10);
    }
    
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

// Update navigation based on scroll position
function updateNavOnScroll() {
    const scrollPosition = window.scrollY;
    
    // Find the current section
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop - 100 && 
            scrollPosition < sectionTop + sectionHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active nav
    if (currentSection) {
        updateActiveNav(currentSection);
    }
}

// Throttle function to limit how often a function runs
function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return callback(...args);
    };
}

// Particle class for background animation
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5; // Slightly smaller particles for better performance
        this.speedX = Math.random() * 0.5 - 0.25; // Reduced speed for smoother motion
        this.speedY = Math.random() * 0.5 - 0.25; // Reduced speed for smoother motion
        this.color = `rgba(100, 255, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.5 + 0.1})`;
    }
    
    update(mouseX, mouseY) {
        // Add slight movement even without mouse interaction
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
        
        // Add mouse interaction if coordinates are provided
        if (mouseX && mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Influence particles within range
            if (distance < 100) {
                // Subtle push effect
                const angle = Math.atan2(dy, dx);
                const pushX = Math.cos(angle) * 0.05;
                const pushY = Math.sin(angle) * 0.05;
                
                this.x += pushX;
                this.y += pushY;
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Setup canvas size
function setupCanvas() {
    // Set canvas size initially
    setCanvasSize();
    
    // Add mouse tracking for particle interaction with debounce
    canvas.addEventListener('mousemove', debounce((e) => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    }, 10));
    
    // Handle mouse leaving the canvas
    canvas.addEventListener('mouseleave', () => {
        mousePosition.x = undefined;
        mousePosition.y = undefined;
    });
    
    // Update canvas size on window resize with debounce
    window.addEventListener('resize', debounce(() => {
        setCanvasSize();
        
        if (!isReducedMotion) {
            initParticles(); // Reinitialize particles when canvas size changes
        } else {
            drawStaticBackground(); // Redraw static background
        }
    }, 250));
}

// Debounce function to prevent excessive function calls
function debounce(callback, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), delay);
    };
}

// Set canvas dimensions
function setCanvasSize() {
    // Set to device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Scale context for high DPI displays
    ctx.scale(dpr, dpr);
    
    // Reset canvas visual size
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
}

// Initialize particles based on screen size
function initParticles() {
    particles = [];
    // Adjust particle count for performance
    const density = 0.00006; // Particles per pixel
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) * density));
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

// Draw static background for reduced motion preference
function drawStaticBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(100, 255, 200, 0.05)';
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animation loop with requestAnimationFrame
function animate() {
    if (isReducedMotion) {
        cancelAnimationFrame(animationId);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all particles
    particles.forEach(particle => {
        particle.update(mousePosition.x, mousePosition.y);
        particle.draw();
    });
    
    // Draw connections between close particles for a network effect
    connectParticles();
    
    // Continue animation loop
    animationId = requestAnimationFrame(animate);
}

// Connect particles that are close to each other
function connectParticles() {
    const connectionDistance = 100; // Max distance for connection
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                // Adjust opacity based on distance
                const opacity = 0.15 * (1 - distance / connectionDistance);
                ctx.strokeStyle = `rgba(100, 255, 200, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Listen for reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isReducedMotion) {
        cancelAnimationFrame(animationId);
        drawStaticBackground();
    } else {
        initParticles();
        animate();
    }
});

// Handle hash changes to navigate to proper section
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});
