const header = document.querySelector(".site-header");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

window.addEventListener("load", () => {
  window.instgrm?.Embeds?.process?.();
});

const photoModal = document.querySelector(".photo-modal");
const modalImage = photoModal?.querySelector("img");
const modalClose = photoModal?.querySelector(".modal-close");

document.querySelectorAll(".gallery-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!photoModal || !modalImage || !image) return;

    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt;
    photoModal.showModal();
  });
});

modalClose?.addEventListener("click", () => {
  photoModal?.close();
});

photoModal?.addEventListener("click", (event) => {
  if (event.target === photoModal) {
    photoModal.close();
  }
});
