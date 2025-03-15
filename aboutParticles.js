// Star background for the About section
document.addEventListener('DOMContentLoaded', function() {
    // Create the canvas for the star background
    const aboutSection = document.getElementById('about');
    
    if (aboutSection) {
        // Create and add the canvas for stars
        const canvas = document.createElement('canvas');
        canvas.id = 'stars-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.3';
        canvas.style.pointerEvents = 'none';
        
        aboutSection.style.position = 'relative';
        aboutSection.style.overflow = 'hidden';
        aboutSection.insertBefore(canvas, aboutSection.firstChild);
        
        // Set canvas dimensions
        canvas.width = aboutSection.offsetWidth;
        canvas.height = aboutSection.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Star class
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.twinkleSpeed = Math.random() * 0.05 + 0.01;
                this.alpha = Math.random();
                this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
            }
            
            update() {
                // Twinkle effect
                this.alpha += this.twinkleSpeed * this.alphaDirection;
                
                // Reverse direction when reaching limits
                if (this.alpha >= 1 || this.alpha <= 0) {
                    this.alphaDirection *= -1;
                }
                
                // Move stars slowly
                this.x += Math.random() * 0.05 - 0.025;
                this.y += Math.random() * 0.05 - 0.025;
                
                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }
        
        // Create stars
        const stars = [];
        const numberOfStars = 100;
        
        for (let i = 0; i < numberOfStars; i++) {
            stars.push(new Star());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        // Add occasional shooting stars
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of shooting star
                const shootingStar = {
                    x: Math.random() * canvas.width,
                    y: 0,
                    length: Math.random() * 80 + 20,
                    speed: Math.random() * 10 + 5,
                    angle: Math.PI / 4 + (Math.random() * Math.PI / 4),
                    life: 1
                };
                
                const shootingStarInterval = setInterval(() => {
                    // Clear the canvas area around the shooting star
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.fillRect(shootingStar.x - 10, shootingStar.y - 10, 
                                shootingStar.length + 20, 20);
                    
                    // Update position
                    shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
                    shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
                    
                    // Draw shooting star
                    if (shootingStar.life > 0) {
                        ctx.beginPath();
                        ctx.moveTo(shootingStar.x, shootingStar.y);
                        ctx.lineTo(
                            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
                            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
                        );
                        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.life})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        
                        // Decrease life
                        shootingStar.life -= 0.02;
                    } else {
                        clearInterval(shootingStarInterval);
                    }
                }, 20);
            }
        }, 3000); // Try to create a shooting star every 3 seconds
        
        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = aboutSection.offsetWidth;
            canvas.height = aboutSection.offsetHeight;
        });
        
        // Start animation
        animate();
    }
});
