// Text typing animation and other visual effects
document.addEventListener('DOMContentLoaded', function() {
    // Typing animation for the header
    const typingText = document.getElementById('typing-text');
    const textToType = "Pavan Gaonkar";
    const typingSpeed = 100; // milliseconds per character
    
    function typeText(text, element, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(text, element, index + 1), typingSpeed);
        } else {
            // Add blinking cursor effect after typing is complete
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            element.appendChild(cursor);
            
            // Blink cursor
            setInterval(() => {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }, 500);
        }
    }
    
    // Start typing animation with a short delay
    setTimeout(() => {
        typingText.textContent = '';
        typeText(textToType, typingText);
    }, 500);
    
    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Smooth scroll to the target element
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Show the section
                showSection(targetId);
            }
        });
    });
    
    // Add hover effect to section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.color = 'var(--primary)';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.color = '';
        });
    });
    
    // Add fade-in effect when scrolling
    const sections = document.querySelectorAll('.section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial check and add scroll event listener
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    
    // Add some CSS for the cursor
    const style = document.createElement('style');
    style.textContent = `
        .cursor {
            font-weight: 100;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .section-title {
            transition: transform 0.3s, color 0.3s;
        }
    `;
    document.head.appendChild(style);
});
