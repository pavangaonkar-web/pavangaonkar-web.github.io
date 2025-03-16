// animations.js - Text animations and UI interactions
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
        }
    }
    
    // Start typing animation with a short delay
    setTimeout(() => {
        typingText.textContent = '';
        typeText(textToType, typingText);
    }, 500);
    
    // Show the about section by default
    showSection('about');
    
    // Add event listeners to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show the section and scroll to it
            showSection(targetId);
            
            // Smooth scroll to the target element
            window.scrollTo({
                top: document.getElementById(targetId).offsetTop - 100,
                behavior: 'smooth'
            });
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
});

// Function to show selected section and hide others
function showSection(id) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Force re-trigger of animation
        selectedSection.style.animation = 'none';
        selectedSection.offsetHeight; // Trigger reflow
        selectedSection.style.animation = 'fadeInUp 0.5s forwards';
    }
}
