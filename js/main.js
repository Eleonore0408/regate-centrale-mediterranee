const toggle = document.getElementById("navToggle");
const nav = document.getElementById("mainNav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Compte à rebours jusqu'à la régate
const countdownEl = document.getElementById("countdown");

if (countdownEl) {
  const eventDate = new Date("2026-11-07T09:00:00+01:00").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");
  const labelEl = document.getElementById("countdownLabel");

  let timer;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      labelEl.textContent = "La régate a commencé, bon vent !";
      countdownEl.style.display = "none";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
}
// Galerie -- onglets par edition
const editionTabs = document.querySelectorAll(".edition-tab");
const editionPanels = document.querySelectorAll(".edition-panel");

if (editionTabs.length) {
  editionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const edition = tab.getAttribute("data-edition");

      editionTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      editionPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-edition") === edition);
      });
    });
  });
}

// Galerie -- lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxDownload = document.getElementById("lightboxDownload");
const galleryImages = document.querySelectorAll(".gallery-grid img");

if (lightbox && galleryImages.length) {
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      const fullSrc = img.getAttribute("data-full") || img.src;
      lightboxImg.src = fullSrc;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");

      if (lightboxDownload) {
        lightboxDownload.href = fullSrc;
        lightboxDownload.setAttribute("download", fullSrc.split("/").pop());
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}
