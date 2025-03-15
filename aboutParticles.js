document.addEventListener("DOMContentLoaded", function () {
    console.log("aboutParticles.js Loaded Successfully!");

    // ✅ Ensure the #about section exists
    const aboutSection = document.getElementById("about");
    if (!aboutSection) {
        console.error("Error: #about section not found!");
        return;
    }

    // ✅ Reset background color (Just for debugging)
    aboutSection.style.background = "rgba(0, 0, 0, 0.2)";

    // ✅ Create a canvas inside #about
    const aboutCanvas = document.createElement("canvas");
    aboutCanvas.id = "aboutCanvas";
    aboutSection.appendChild(aboutCanvas);
    aboutCanvas.width = aboutSection.clientWidth;
    aboutCanvas.height = aboutSection.clientHeight;
    const ctx = aboutCanvas.getContext("2d");

    // ✅ Test if canvas is working by drawing WHITE dots
    ctx.fillStyle = "white";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(50 + i * 30, 50, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    console.log("Canvas test successful!");
});
