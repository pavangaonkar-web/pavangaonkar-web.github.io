// DOM elements
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const navLinks = document.querySelectorAll('.nav-link'); 
const sections = document.querySelectorAll('.section');

// Particles array
let particles = [];
let mousePosition = { x: undefined, y: undefined };

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupCanvas();
    initParticles();
    animate();
    
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
}

// Show selected section with smooth transition
function showSection(id) {
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

// Particle class for background animation
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5; // Reduced speed for smoother motion
        this.speedY = Math.random() * 1 - 0.5; // Reduced speed for smoother motion
        // Create blue-cyan color variations
        this.color = `rgba(100, ${Math.floor(Math.random() * 155 + 100)}, 255, ${Math.random() * 0.5 + 0.2})`;
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
        
        // Add mouse interaction if coordinates are provided
        if (mousePosition.x && mousePosition.y) {
            const dx = mousePosition.x - this.x;
            const dy = mousePosition.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                // Push particles away from mouse
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (100 - distance) / 100;
                
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
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
    
    // Add mouse tracking for particle interaction
    canvas.addEventListener('mousemove', (e) => {
        mousePosition.x = e.x;
        mousePosition.y = e.y;
    });
    
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

// Initialize particles based on screen size
function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

// Track mouse position for particle interaction
document.addEventListener('mousemove', (e) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create a dark blue background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections between close particles for a network effect
    connectParticles();
    
    // Continue animation loop
    requestAnimationFrame(animate);
}

// Connect particles that are close to each other
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                // Adjust opacity based on distance
                ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 - (distance/750)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Handle hash changes to navigate to proper section
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});
