document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contact-button").addEventListener("click", () => {
  window.location.href = "mailto:hello@sportsacademy.example";
});
