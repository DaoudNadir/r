const hamburger = document.querySelector(".hamburger");
const backdrop = document.querySelector(".mobile-menu-backdrop");
const closeBtn = document.querySelector(".mobile-menu-close");

function setMenuOpen(isOpen) {
  if (!hamburger || !backdrop) return;
  hamburger.classList.toggle("is-open", isOpen);
  backdrop.classList.toggle("is-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  backdrop.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    const first = backdrop.querySelector("button, [href], input, [tabindex]");
    if (first) first.focus();
  } else {
    hamburger.focus();
  }
}

if (hamburger && backdrop) {
  hamburger.addEventListener("click", () => {
    const isOpen = !hamburger.classList.contains("is-open");
    setMenuOpen(isOpen);
  });

  closeBtn?.addEventListener("click", () => setMenuOpen(false));

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}
