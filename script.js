// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const cvIframe = document.getElementById('cv-iframe');
    const cvFrame = document.querySelector('.cv-frame');
    const cvFallback = document.querySelector('.cv-fallback');
    const yearEl = document.getElementById('current-year');
    const headerTitle = document.querySelector('header h1');
    
    // Update copyright year
    yearEl.textContent = new Date().getFullYear();
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section ID from data attribute
            const sectionId = this.getAttribute('data-section');
            
            // Remove active class from all links and sections
            navLinks.forEach(el => el.classList.remove('active'));
            sections.forEach(el => el.classList.remove('active'));
            
            // Add active class to current link and section
            this.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });
    
    // Handle page load with hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1) || 'about';
        const targetSection = document.getElementById(hash);
        
        if (targetSection) {
            // Deactivate all sections and links
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Activate target section and corresponding link
            targetSection.classList.add('active');
            const targetLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }
        }
    }
    
    // Initialize page based on hash or default to 'about'
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check if CV PDF exists and show appropriate view
    function checkCVAvailability() {
        fetch('pavan_cv.pdf', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // PDF exists, show iframe
                    cvFrame.classList.add('active');
                    cvFallback.style.display = 'none';
                } else {
                    // PDF does not exist, show fallback
                    cvFrame.classList.remove('active');
                    cvFallback.style.display = 'flex';
                }
            })
            .catch(error => {
                // Error, show fallback
                cvFrame.classList.remove('active');
                cvFallback.style.display = 'flex';
                console.error('Error checking CV availability:', error);
            });
    }
    
    // Check CV availability when CV section is activated
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === 'cv') {
            link.addEventListener('click', checkCVAvailability);
        }
    });
    
    // If CV section is active on page load, check availability
    if (window.location.hash === '#cv') {
        checkCVAvailability();
    }
    
    // Handle mobile navigation
    function adjustNavigation() {
        if (window.innerWidth <= 768) {
            // Add touch-friendly behavior for mobile if needed
            // This is where you would add mobile menu toggle functionality
            // if you decide to implement a hamburger menu in the future
        }
    }
    
    // Run on page load and window resize
    adjustNavigation();
    window.addEventListener('resize', adjustNavigation);
    
    // Fix header title underline position based on screen width
    function adjustHeaderUnderline() {
        if (headerTitle) {
            // Get the computed styles
            const titleWidth = headerTitle.offsetWidth;
            const headerStyles = window.getComputedStyle(headerTitle, '::after');
            
            // For mobile screens (centered title)
            if (window.innerWidth <= 768) {
                // Apply custom styles for the underline on mobile
                headerTitle.style.position = 'relative';
                
                // Create or update the underline element
                let underline = headerTitle.querySelector('.title-underline');
                if (!underline) {
                    underline = document.createElement('span');
                    underline.className = 'title-underline';
                    headerTitle.appendChild(underline);
                }
                
                // Style the underline
                underline.style.position = 'absolute';
                underline.style.bottom = '-5px';
                underline.style.left = '50%';
                underline.style.transform = 'translateX(-50%)';
                underline.style.width = '40px';
                underline.style.height = '3px';
                underline.style.backgroundColor = 'var(--secondary-color)';
                underline.style.borderRadius = '3px';
                underline.style.display = 'block';
            } else {
                // For desktop, use the CSS default
                const underline = headerTitle.querySelector('.title-underline');
                if (underline) {
                    underline.remove();
                }
                headerTitle.style.position = '';
            }
        }
    }
    
    // Run the adjustment function
    adjustHeaderUnderline();
    window.addEventListener('resize', adjustHeaderUnderline);
    
    // Add basic loading state for iframe
    if (cvIframe) {
        cvIframe.addEventListener('load', function() {
            this.style.opacity = 1;
        });
        
        cvIframe.style.opacity = 0;
        cvIframe.style.transition = 'opacity 0.3s ease';
    }
    
    // Optional: Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // This is handled by the navigation system already
            // but kept here for any other internal links
            if (!this.classList.contains('nav-link')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Adjust for header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
