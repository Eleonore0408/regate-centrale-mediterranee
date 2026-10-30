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
      // Un 2e clic sur l'edition ouverte la referme
      const closing = tab.classList.contains("active");

      editionTabs.forEach((t) => {
        const isOpen = !closing && t === tab;
        t.classList.toggle("active", isOpen);
        t.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      editionPanels.forEach((panel) => {
        panel.classList.toggle("active", !closing && panel.getAttribute("data-edition") === edition);
      });
    });
  });
}

// Galerie -- afficher les photos petit a petit (bouton "Voir plus")
document.querySelectorAll(".gallery-grid[data-initial]").forEach((grid) => {
  const images = Array.from(grid.querySelectorAll("img"));
  const step = parseInt(grid.dataset.step, 10) || 24;
  const button = grid.parentElement.querySelector(".gallery-more");
  let visible = parseInt(grid.dataset.initial, 10) || 12;

  function render() {
    images.forEach((img, i) => img.classList.toggle("is-hidden", i >= visible));
    const remaining = images.length - visible;
    if (!button) return;
    if (remaining > 0) {
      button.hidden = false;
      button.textContent = "Voir plus de photos (" + remaining + " restantes)";
    } else {
      button.hidden = true;
    }
  }

  if (button) {
    button.addEventListener("click", () => {
      visible += step;
      render();
    });
  }
  render();
});

// Galerie -- lightbox avec navigation clavier/fleches
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxDownload = document.getElementById("lightboxDownload");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const galleryGrids = document.querySelectorAll(".gallery-grid");

let currentGalleryImages = [];
let currentImageIndex = 0;

function showLightboxImage(index) {
  if (!currentGalleryImages.length) return;
  currentImageIndex = (index + currentGalleryImages.length) % currentGalleryImages.length;
  const img = currentGalleryImages[currentImageIndex];
  const fullSrc = img.getAttribute("data-full") || img.src;

  lightboxImg.src = fullSrc;
  lightboxImg.alt = img.alt;

  if (lightboxDownload) {
    lightboxDownload.href = fullSrc;
    lightboxDownload.setAttribute("download", fullSrc.split("/").pop());
  }
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxImg.src = "";
}

if (lightbox && galleryGrids.length) {
  galleryGrids.forEach((grid) => {
    const imagesInGrid = Array.from(grid.querySelectorAll("img"));

    imagesInGrid.forEach((img, idx) => {
      img.addEventListener("click", () => {
        currentGalleryImages = imagesInGrid;
        showLightboxImage(idx);
        lightbox.classList.add("open");
      });
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightboxImage(currentImageIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showLightboxImage(currentImageIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightboxImage(currentImageIndex - 1);
    if (e.key === "ArrowRight") showLightboxImage(currentImageIndex + 1);
  });
}
