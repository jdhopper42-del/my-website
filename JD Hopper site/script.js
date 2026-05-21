const snapContainer = document.querySelector(".snap-container");
const revealSections = document.querySelectorAll(".reveal-section");
const floatingCta = document.querySelector(".floating-cta");
const modal = document.querySelector("#contact-modal");
const modalCard = modal?.querySelector(".modal-card");
const openModalButtons = document.querySelectorAll("[data-open-contact]");
const closeModalButtons = document.querySelectorAll("[data-close-contact]");
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

let lastFocusedElement = null;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    root: snapContainer,
    threshold: 0.42
  }
);

revealSections.forEach((section) => revealObserver.observe(section));

function getVisibleHeroVideo() {
  return [...document.querySelectorAll(".hero-video")].find((video) => {
    return getComputedStyle(video).display !== "none";
  });
}

function playVisibleHeroVideo() {
  const video = getVisibleHeroVideo();
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.removeAttribute("controls");
  video.play().catch(() => {
    video.removeAttribute("controls");
  });
}

document.querySelector("[data-hero-start]")?.addEventListener("click", () => {
  playVisibleHeroVideo();
  document.querySelector("#purpose")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

function updateFloatingCtaPulse() {
  const purposeTop = document.querySelector("#purpose")?.offsetTop ?? Number.POSITIVE_INFINITY;
  const scrollTop = snapContainer?.scrollTop ?? window.scrollY;
  const shouldShow = scrollTop >= purposeTop - 8;
  floatingCta?.classList.toggle("is-visible", shouldShow);
  floatingCta?.classList.toggle("is-pulsing", shouldShow);
}

function updateFixedElements() {
  updateFloatingCtaPulse();
}

snapContainer?.addEventListener("scroll", updateFixedElements, { passive: true });
window.addEventListener("resize", updateFixedElements);
updateFixedElements();

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTarget);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!isExpanded));
  });
});

document.querySelectorAll("[data-expand-button]").forEach((button) => {
  button.addEventListener("click", () => {
    const story = button.closest("[data-expandable]");
    const section = button.closest(".snap-section");
    const isExpanded = story?.classList.toggle("is-expanded") ?? false;

    button.setAttribute("aria-expanded", String(isExpanded));
    button.textContent = isExpanded ? "Collapse" : "Click to Expand";
    section?.classList.toggle("has-expanded-story", isExpanded);
  });
});

function getFocusableElements() {
  return [...(modalCard?.querySelectorAll(focusableSelector) ?? [])].filter((element) => {
    return element.offsetParent !== null || element === document.activeElement;
  });
}

function openContactModal() {
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    const firstFocusable = getFocusableElements()[0];
    firstFocusable?.focus();
  });
}

function closeContactModal() {
  if (!modal) return;

  modal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

openModalButtons.forEach((button) => {
  button.addEventListener("click", openContactModal);
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeContactModal);
});

document.addEventListener("keydown", (event) => {
  if (!modal || modal.hidden) return;

  if (event.key === "Escape") {
    closeContactModal();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!firstElement || !lastElement) return;

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

document.querySelectorAll("video[autoplay]").forEach((video) => {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
  video.play().catch(() => {
    video.removeAttribute("controls");
  });
});

document.addEventListener("touchstart", playVisibleHeroVideo, { once: true, passive: true });
document.addEventListener("pointerdown", playVisibleHeroVideo, { once: true });
