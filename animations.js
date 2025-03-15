document.addEventListener("DOMContentLoaded", function () {
    // Typing Effect
    const text = ["Hello, I'm Pavan!", "Physics Enthusiast", "Aspiring Researcher"];
    let index = 0;
    let charIndex = 0;
    const typingElement = document.getElementById("typing-text");

    function type() {
        if (charIndex < text[index].length) {
            typingElement.textContent += text[index].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingElement.textContent = text[index].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            index = (index + 1) % text.length;
            setTimeout(type, 500);
        }
    }

    type();

    // Section Fade-in Animation
    const sections = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // Button Hover Effect
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseover", () => button.style.transform = "scale(1.1)");
        button.addEventListener("mouseleave", () => button.style.transform = "scale(1)");
    });
});
