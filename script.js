document.documentElement.classList.add("js-ready");

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const brandRail = document.querySelector("#brand-rail");
const progressFill = document.querySelector(".rail-progress span");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("is-open", !isExpanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  });
});

document.querySelectorAll("[data-scroll][data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    const direction = button.dataset.scroll === "next" ? 1 : -1;
    target.scrollBy({
      left: direction * target.clientWidth * 0.78,
      behavior: "smooth",
    });
  });
});

function updateBrandProgress() {
  if (!brandRail || !progressFill) return;
  const maxScroll = brandRail.scrollWidth - brandRail.clientWidth;
  const progress = maxScroll > 0 ? brandRail.scrollLeft / maxScroll : 0;
  progressFill.style.width = `${25 + progress * 75}%`;
}

brandRail?.addEventListener("scroll", updateBrandProgress, { passive: true });
window.addEventListener("resize", updateBrandProgress);
updateBrandProgress();

const revealTargets = document.querySelectorAll(
  ".intro-grid, .fact-strip, .brand-card, .type-card, .responsibility-copy, .story-card, .news-item",
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
