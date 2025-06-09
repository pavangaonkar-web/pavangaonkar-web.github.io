// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation elements
    const hamburgerBtn = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', function() {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        
        hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Section navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu after navigation
            closeMobileMenu();
            
            // Add pulse animation to clicked nav link
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 500);
        });
    });
    
    function showSection(targetId) {
        // Hide all sections with slide-out animation
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.add('slide-out');
                section.classList.remove('slide-in');
                
                setTimeout(() => {
                    section.classList.remove('active', 'slide-out');
                }, 300);
            }
        });
        
        // Show target section with slide-in animation
        setTimeout(() => {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active', 'slide-in');
                targetSection.classList.remove('slide-out');
                
                // Trigger section-specific animations
                triggerSectionAnimations(targetId);
            }
        }, 300);
    }
    
    function triggerSectionAnimations(sectionId) {
        setTimeout(() => {
            switch(sectionId) {
                case 'about':
                    animateAboutSection();
                    break;
                case 'cv':
                    animateCvSection();
                    break;
                case 'projects':
                    animateProjectsSection();
                    break;
                case 'blog':
                    animateBlogSection();
                    break;
                case 'contact':
                    animateContactSection();
                    break;
            }
        }, 100);
    }
    
    // About section text reveal animation
    function animateAboutSection() {
        const revealTexts = document.querySelectorAll('.reveal-text');
        
        revealTexts.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('visible');
            }, index * 200);
        });
    }
    
    // CV section animation
    function animateCvSection() {
        const cvContainer = document.querySelector('.cv-container');
        const buttons = document.querySelectorAll('.cv-actions .btn');
        
        cvContainer.classList.add('fade-scale-in');
        
        buttons.forEach((btn, index) => {
            setTimeout(() => {
                btn.classList.add('bounce-in');
            }, 300 + (index * 150));
        });
    }
    
    // Projects section animation
    function animateProjectsSection() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('bounce-in');
            }, index * 200);
        });
    }
    
    // Blog section animation
    function animateBlogSection() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('bounce-in');
            }, index * 200);
        });
    }
    
    // Contact section animation
    function animateContactSection() {
        const contactItems = document.querySelectorAll('.contact-item');
        const contactBtn = document.querySelector('.linkedin-btn');
        
        contactItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-scale-in');
            }, index * 150);
        });
        
        setTimeout(() => {
            if (contactBtn) {
                contactBtn.classList.add('bounce-in');
            }
        }, contactItems.length * 150 + 200);
    }
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.03)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(2px) scale(0.98)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-4px) scale(1.03)';
        });
    });
    
    // Update current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for better UX (fallback for older browsers)
    if (!CSS.supports('scroll-behavior', 'smooth')) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Enhanced keyboard navigation
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add loading animation to external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '';
            }, 300);
        });
    });
    
    // Intersection Observer for scroll-triggered animations (for future content)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements with animate-on-enter class
    const animateOnEnterElements = document.querySelectorAll('.animate-on-enter');
    animateOnEnterElements.forEach(el => observer.observe(el));
    
    // Performance optimization: Reduce animations on slower devices
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(e) {
        if (e.matches) {
            // Disable complex animations for users who prefer reduced motion
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    
    reduceMotionQuery.addEventListener('change', handleReducedMotion);
    handleReducedMotion(reduceMotionQuery);
    
    // Error handling for missing images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
    
    // Initialize the about section as active with animations
    setTimeout(() => {
        animateAboutSection();
    }, 500);
    
    console.log('Website initialized successfully! 🚀');
});
