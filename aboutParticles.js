document.addEventListener("DOMContentLoaded", function () {
    console.log("aboutParticles.js Loaded Successfully!");

    // ✅ Ensure the #about section exists
    const aboutSection = document.getElementById("about");
    if (!aboutSection) {
        console.error("Error: #about section not found!");
        return;
    }

    // ✅ Create a test background color to see if canvas is added
    aboutSection.style.background = "rgba(0, 0, 0, 0.5)"; // Just for testing

    const aboutCanvas = document.createElement("canvas");
    aboutCanvas.id = "aboutCanvas";
    aboutSection.appendChild(aboutCanvas);
    aboutCanvas.width = aboutSection.clientWidth;
    aboutCanvas.height = aboutSection.clientHeight;
    const ctx = aboutCanvas.getContext("2d");

    // ✅ Test if canvas is working by drawing a red rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, 50, 50); // A small red box should appear

    console.log("Canvas test successful!");
});
