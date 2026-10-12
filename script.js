
document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(
    document.querySelectorAll(".gallery-card")
  );

  const filterButtons = document.querySelectorAll(".filter-btn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const closeButton = document.getElementById("closeLightbox");
  const prevButton = document.getElementById("prevImage");
  const nextButton = document.getElementById("nextImage");
  const imageCount = document.getElementById("imageCount");

  let visibleCards = [...cards];
  let currentIndex = 0;
  let lastFocusedElement = null;

  // Show the total number of visible images
  function updateCount() {
    imageCount.textContent =
      `${visibleCards.length} photographs found`;
  }

  // Filter images by category
  function filterGallery(category) {
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === category;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      card.hidden =
        category !== "all" &&
        card.dataset.category !== category;
    });

    visibleCards = cards.filter((card) => !card.hidden);

    updateCount();

    // If the active category changes while the viewer is open,
    // close it to avoid showing an image outside the selected filter.
    if (lightbox.classList.contains("active")) {
      closeLightbox();
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterGallery(button.dataset.filter);
    });
  });

  // Open the selected image
  function openLightbox(card) {
    const index = visibleCards.indexOf(card);

    if (index === -1) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;

    const button = card.querySelector(".image-button");
    const thumbnail = button.querySelector("img");
    const fullImage = button.dataset.full || thumbnail.src;

    lightboxImage.src = fullImage;
    lightboxImage.alt = thumbnail.alt;
    lightboxCaption.textContent =
      card.querySelector("h3").textContent;

    lightboxCounter.textContent =
      `${currentIndex + 1} / ${visibleCards.length}`;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    closeButton.focus();
  }

  // Close the image viewer
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    lightboxImage.src = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Display next or previous image
  function showImage(direction) {
    if (visibleCards.length === 0) return;

    currentIndex =
      (currentIndex + direction + visibleCards.length) %
      visibleCards.length;

    const card = visibleCards[currentIndex];
    const button = card.querySelector(".image-button");
    const thumbnail = button.querySelector("img");

    lightboxImage.src = button.dataset.full || thumbnail.src;
    lightboxImage.alt = thumbnail.alt;
    lightboxCaption.textContent =
      card.querySelector("h3").textContent;

    lightboxCounter.textContent =
      `${currentIndex + 1} / ${visibleCards.length}`;
  }

  // Open viewer on image click
  cards.forEach((card) => {
    card.querySelector(".image-button").addEventListener("click", () => {
      openLightbox(card);
    });
  });

  // Navigation buttons
  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    showImage(-1);
  });

  nextButton.addEventListener("click", () => {
    showImage(1);
  });

  // Close when the dark background is clicked
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation: Escape, left and right arrows
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showImage(-1);
    } else if (event.key === "ArrowRight") {
      showImage(1);
    }
  });

  // Initialize gallery
  filterGallery("all");
});
