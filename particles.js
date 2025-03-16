// particles.js - Consolidated background animation
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        // Set canvas size and handle resize
        this.setCanvasSize();
        window.addEventListener('resize', () => this.setCanvasSize());
        
        // Track mouse position
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });
        
        // Initialize particles
        this.initParticles();
    }
    
    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Reinitialize particles when window resizes
        if (this.particles.length > 0) {
            this.initParticles();
        }
    }
    
    initParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particles.push(new Particle(x, y));
        }
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(100, 150, 255, ${0.2 - distance/750})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        // Clear the canvas
        this.ctx.fillStyle = '#0d1117'; // Dark background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    
                    this.particles[i].x += forceDirectionX * force * 2;
                    this.particles[i].y += forceDirectionY * force * 2;
                }
            }
        }
        
        // Connect particles with lines
        this.connectParticles();
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.animate();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        // Create blue-cyan color variations
        this.color = `rgba(100, ${Math.floor(Math.random() * 155 + 100)}, 255, ${Math.random() * 0.5 + 0.2})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > window.innerWidth || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > window.innerHeight || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particle system when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    const particleSystem = new ParticleSystem('background');
    particleSystem.start();
});
