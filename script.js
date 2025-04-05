document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas element
    const canvas = document.getElementById('background');
    const ctx = canvas.getContext('2d');
    
    // Performance optimization
    let animationFrameId;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    // Mouse interaction
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };
    
    // Track window dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Set canvas size to window size with device pixel ratio for sharp rendering
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        
        // Set display size (css pixels)
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = windowHeight + 'px';
        
        // Set actual size scaled by dpr
        canvas.width = windowWidth * dpr;
        canvas.height = windowHeight * dpr;
        
        // Scale context to match dpr
        ctx.scale(dpr, dpr);
        
        // Reinitialize particles when resize happens
        initParticles();
    }
    
    // Mouse move event handler
    function handleMouseMove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
    
    // Mouse leave event handler
    function handleMouseLeave() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
    
    // Touch move event handler for mobile
    function handleTouchMove(event) {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    }
    
    // Touch end event handler
    function handleTouchEnd() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
    
    // Enhanced Particle class
    class Particle {
        constructor(x, y) {
            // Allow for specific positioning or random
            this.x = x || Math.random() * windowWidth;
            this.y = y || Math.random() * windowHeight;
            
            // More varied sizes with normal distribution
            this.size = (Math.random() + Math.random() + Math.random()) / 3 * 2.5 + 0.5;
            
            // Base speed varies by size (smaller = faster)
            const speedFactor = 0.8 / this.size;
            this.baseSpeedX = (Math.random() - 0.5) * speedFactor;
            this.baseSpeedY = (Math.random() - 0.5) * speedFactor;
            
            // Current speed (will be affected by mouse)
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            
            // Each particle gets a hue, but similar for cohesion
            this.hue = Math.random() * 30 + 220; // Blue to purple range
            this.saturation = Math.random() * 40 + 60; // Reasonably saturated
            this.lightness = Math.random() * 30 + 60; // Medium to bright
            this.alpha = Math.random() * 0.4 + 0.3; // Semi-transparent
            
            // For mouse interaction
            this.density = (Math.random() * 30) + 1;
        }
        
        getColor(opacity = this.alpha) {
            return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${opacity})`;
        }
        
        update() {
            // Store previous position for velocity calculation
            this.prevX = this.x;
            this.prevY = this.y;
            
            // Reset to base speed
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            
            // Mouse interaction if mouse is on screen
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Calculate force direction from mouse
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    
                    // Calculate force strength (closer = stronger)
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Apply force away from mouse
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;
                    
                    this.speedX -= directionX * 0.2;
                    this.speedY -= directionY * 0.2;
                }
            }
            
            // Update position
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check with bounce
            if (this.x < 0) {
                this.x = 0;
                this.speedX = -this.speedX * 0.5;
            } else if (this.x > windowWidth) {
                this.x = windowWidth;
                this.speedX = -this.speedX * 0.5;
            }
            
            if (this.y < 0) {
                this.y = 0;
                this.speedY = -this.speedY * 0.5;
            } else if (this.y > windowHeight) {
                this.y = windowHeight;
                this.speedY = -this.speedY * 0.5;
            }
        }
        
        draw() {
            ctx.fillStyle = this.getColor();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create array for particles
    let particles = [];
    
    // Initialize particles with optimal count based on screen size
    function initParticles() {
        particles = [];
        const area = windowWidth * windowHeight;
        const particleCount = Math.min(Math.floor(area / 6000), 200);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles with lines if they are close enough
    function connectParticles() {
        const maxDistance = windowWidth > 768 ? 150 : 100;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = dx * dx + dy * dy; // Squared distance for performance
                
                if (distance < maxDistance * maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (Math.sqrt(distance) / maxDistance);
                    
                    // Blend colors of both particles
                    const hue = (particles[i].hue + particles[j].hue) / 2;
                    const saturation = (particles[i].saturation + particles[j].saturation) / 2;
                    const lightness = (particles[i].lightness + particles[j].lightness) / 2;
                    
                    ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.3})`;
                    ctx.lineWidth = Math.min(particles[i].size, particles[j].size) * 0.3;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop with time-based animation
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        
        if (deltaTime > interval) {
            // Clear the canvas with slight fade effect for trails
            ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
            ctx.fillRect(0, 0, windowWidth, windowHeight);
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            // Connect particles with lines
            connectParticles();
            
            lastTime = timestamp - (deltaTime % interval);
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Pause animation when tab is not visible for performance
    function handleVisibilityChange() {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    
    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get header height dynamically
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
                
                // Update active state manually
                updateActiveNavLink(targetId.substring(1));
            }
        });
    });
    
    // Improved intersection observer for section visibility
    function setupIntersectionObserver() {
        const sections = document.querySelectorAll('.section');
        const options = {
            root: null,
            rootMargin: '-80px 0px 0px 0px', // Offset for header
            threshold: 0.3 // 30% of the section must be visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateActiveNavLink(entry.target.id);
                }
            });
        }, options);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Update active nav link
    function updateActiveNavLink(currentId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentId) {
                link.classList.add('active');
            }
        });
    }
    
    // Initialize everything
    resizeCanvas();
    setupIntersectionObserver();
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
    
    // Clean up event listeners on page unload
    window.addEventListener('unload', () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        cancelAnimationFrame(animationFrameId);
    });
});
