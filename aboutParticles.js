document.addEventListener("DOMContentLoaded", function () {
    console.log("aboutParticles.js Loaded Successfully!");

    // ✅ Ensure the #about section exists
    const aboutSection = document.getElementById("about");
    if (!aboutSection) {
        console.error("Error: #about section not found!");
        return;
    }

    // ✅ Create a new canvas inside #about
    const aboutCanvas = document.createElement("canvas");
    aboutCanvas.id = "aboutCanvas";
    aboutSection.appendChild(aboutCanvas);
    aboutCanvas.width = aboutSection.clientWidth;
    aboutCanvas.height = aboutSection.clientHeight;
    const ctx = aboutCanvas.getContext("2d");

    // ✅ Auto-adjust canvas size on window resize
    window.addEventListener("resize", function () {
        aboutCanvas.width = aboutSection.clientWidth;
        aboutCanvas.height = aboutSection.clientHeight;
    });

    // ✅ Create moving particles
    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * aboutCanvas.width,
            y: Math.random() * aboutCanvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8, // Slow, subtle movement
            speedY: (Math.random() - 0.5) * 0.8
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce particles back if they reach the edges
            if (p.x < 0 || p.x > aboutCanvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > aboutCanvas.height) p.speedY *= -1;

            // Draw particles
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // Light white glow effect
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
