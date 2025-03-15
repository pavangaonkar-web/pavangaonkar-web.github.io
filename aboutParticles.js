document.addEventListener("DOMContentLoaded", function () {
    console.log("aboutParticles.js Loaded Successfully!");

    // ✅ Create a unique canvas for the about section
    const aboutSection = document.getElementById("about");
    if (!aboutSection) {
        console.error("Error: #about section not found!");
        return;
    }

    const aboutCanvas = document.createElement("canvas");
    aboutSection.appendChild(aboutCanvas);
    aboutCanvas.width = aboutSection.clientWidth;
    aboutCanvas.height = aboutSection.clientHeight;
    const ctx = aboutCanvas.getContext("2d");

    // ✅ Adjust canvas when resizing
    window.addEventListener("resize", function () {
        aboutCanvas.width = aboutSection.clientWidth;
        aboutCanvas.height = aboutSection.clientHeight;
    });

    // ✅ Create floating particles
    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * aboutCanvas.width,
            y: Math.random() * aboutCanvas.height,
            size: Math.random() * 3,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > aboutCanvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > aboutCanvas.height) p.speedY *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
