const toggle = document.getElementById("navToggle");
const nav = document.getElementById("mainNav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});