document.addEventListener("DOMContentLoaded", function () {
    console.log("Animations.js Loaded Successfully!");

    // ✅ Typing Effect (Only "Pavan Gaonkar", No Double Letters)
    const text = "Pavan Gaonkar";
    let charIndex = 0;
    const typingElement = document.getElementById("typing-text");

    function type() {
        if (charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        }
    }

    // Ensure text starts empty before typing begins
    typingElement.textContent = "";
    type();

    // ✅ Smooth Scroll Effect for Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ✅ Fade-in Effect for Sections on Scroll
    const sections = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // ✅ Back to Top Button
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

});


