document.addEventListener("DOMContentLoaded", function () {
    // Typing Effect (Only "Pavan Gaonkar")
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

    // Prevent the page from moving when text is empty
    typingElement.style.minHeight = "1em";
    type();
});
