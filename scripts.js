document.addEventListener("DOMContentLoaded", () => {
    console.log("PixelLumo site loaded");

    // Contact form submit alert
    const form = document.getElementById("contactForm");
    if(form){
        form.addEventListener("submit", e => {
            e.preventDefault();
            alert("Thank you for your message! We'll get back to you soon.");
            form.reset();
        });
    }
});
