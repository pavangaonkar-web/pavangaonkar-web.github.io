// Particle system for the header background
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    
    // Insert canvas before the first child of header
    const header = document.querySelector('header');
    header.insertBefore(canvas, header.firstChild);
    
    // Configure canvas
    const ctx = canvas.getContext('2d');
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;
    
    // Particle settings
    const particlesArray = [];
    const numberOfParticles = 100;
    let hue = 170; // Starting color (cyan/blue)
    
    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Track mouse position
    window.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
    });
    
    // Create particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${hue}, 100%, 50%)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }
            
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                this.speedX += forceDirectionX * force * 0.6;
                this.speedY += forceDirectionY * force * 0.6;
            }
            
            // Limit speed
            this.speedX = Math.max(-3, Math.min(3, this.speedX));
            this.speedY = Math.max(-3, Math.min(3, this.speedY));
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Connect particles with lines
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.2;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Slowly change hue
        hue += 0.5;
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = header.offsetWidth;
        canvas.height = header.offsetHeight;
    });
    
    init();
    animate();
});
