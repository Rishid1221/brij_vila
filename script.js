// ============================================================
// CORE UI ELEMENTS & AUTOMATIC LIGHTBOX BOOTSTRAP
// ============================================================

// 1. Auto-inject Lightbox CSS styles if not already present in head
if (!document.getElementById("auto-lightbox-styles")) {
  const styleTag = document.createElement("style");
  styleTag.id = "auto-lightbox-styles";
  styleTag.textContent = `
    .lightbox-auto-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(10, 10, 10, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lightbox-auto-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .lightbox-auto-overlay img {
      max-width: 88vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid rgba(197, 160, 89, 0.4);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
      transform: scale(0.94);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lightbox-auto-overlay.active img {
      transform: scale(1);
    }
    .lightbox-auto-close {
      position: absolute;
      top: 24px;
      right: 32px;
      font-size: 2.2rem;
      color: #c5a059;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s, transform 0.2s;
    }
    .lightbox-auto-close:hover {
      color: #ffffff;
      transform: scale(1.15);
    }
  `;
  document.head.appendChild(styleTag);
}

// 2. Auto-inject Lightbox HTML markup if missing in body
let lightbox = document.getElementById("lightbox");
let lightboxImg = document.getElementById("lightbox-img");

if (!lightbox) {
  lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.className = "lightbox-auto-overlay";

  const closeBtn = document.createElement("span");
  closeBtn.className = "lightbox-auto-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeLightbox;

  lightboxImg = document.createElement("img");
  lightboxImg.id = "lightbox-img";

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(lightboxImg);

  // Append once DOM is available
  if (document.body) {
    document.body.appendChild(lightbox);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(lightbox);
    });
  }
}

const scrollBar = document.getElementById("scroll-progress");
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");
const navClose = document.getElementById("navClose");
const mobLinks = document.querySelectorAll(".mob-link");
const revealEls = document.querySelectorAll(".reveal");
const heroBg = document.querySelector(".hero-image-bg");
const heroOrb1 = document.querySelector(".hero-orb-1");
const heroOrb2 = document.querySelector(".hero-orb-2");
const heroOrb3 = document.querySelector(".hero-orb-3");
const heroContent = document.querySelector(".hero-content");
const sections = document.querySelectorAll("section");

// 3D / depth elements — each entry normalized to { el, depth }
const depthTargets = [
  { el: document.querySelector(".about-img-main"), depth: 1.15 },
  { el: document.querySelector(".about-img-accent"), depth: 0.75 },
  { el: document.querySelector(".weddings-main-img"), depth: 0.95 },
  { el: document.querySelector(".map-container"), depth: 0.8 },
  ...Array.from(
    document.querySelectorAll(
      ".room-card, .amenity-card, .testimonial-card, .weddings-feature, .contact-card, .wb-item, .g-item",
    ),
  ).map((el) => ({ el, depth: 1 })),
].filter((item) => item.el);

const isReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let isMobile = window.matchMedia("(max-width: 768px)").matches;

// ============================================================
// HELPERS — MOBILE NAV
// ============================================================
function openMobileNav() {
  mobileNav?.classList.add("open");
  hamburger?.classList.add("active");
  hamburger?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  mobileNav?.classList.remove("open");
  hamburger?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

// ============================================================
// HELPERS — LIGHTBOX
// ============================================================
function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => {
    if (lightboxImg) lightboxImg.src = "";
  }, 350);
}

// ============================================================
// HELPERS — FORM → WhatsApp enquiry
// ============================================================
const BRIJ_VILLA_WHATSAPP = "918769878788";

function handleForm(e) {
  e.preventDefault();

  const form = document.getElementById("enquiryForm");
  if (!form) return;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = form.fname.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const purpose = form.purpose.value.trim();
  const checkin = form.checkin.value;
  const guests = form.guests.value.trim();
  const message = form.message.value.trim();

  const lines = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : "",
    purpose ? `Purpose: ${purpose}` : "",
    checkin ? `Check-in: ${checkin}` : "",
    guests ? `Guests: ${guests}` : "",
    message ? `Message: ${message}` : "",
  ].filter(Boolean);

  const whatsappText = lines.join("\n");
  const encodedText = encodeURIComponent(whatsappText);
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const whatsappUrl = isMobile
    ? `https://wa.me/${BRIJ_VILLA_WHATSAPP}?text=${encodedText}`
    : `https://web.whatsapp.com/send?phone=${BRIJ_VILLA_WHATSAPP}&text=${encodedText}`;

  if (isMobile) {
    window.location.href = whatsappUrl;
    form.reset();
    return;
  }

  const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  // Reset only after WhatsApp action is triggered (not on validation failure)
  if (whatsappWindow !== null) {
    form.reset();
  }
}

// Expose for inline handlers in the HTML (onclick="openLightbox(...)" etc.)
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleForm = handleForm;

// ============================================================
// INTERACTIONS — NAV
// ============================================================
hamburger?.addEventListener("click", () => {
  if (mobileNav.classList.contains("open")) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

navClose?.addEventListener("click", closeMobileNav);
mobLinks.forEach((l) => l.addEventListener("click", closeMobileNav));

// Close mobile nav if window is resized up past the mobile breakpoint
window.addEventListener("resize", () => {
  isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile && mobileNav.classList.contains("open")) {
    closeMobileNav();
  }
});

// ============================================================
// INTERACTIONS — LIGHTBOX & GLOBAL KEYS
// ============================================================
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeMobileNav();
  }
});

// ============================================================
// SMOOTH ANCHOR SCROLLING
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    closeMobileNav();
    const offset = window.innerWidth <= 768 ? 66 : 74;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: isReducedMotion ? "auto" : "smooth" });
  });
});

// ============================================================
// SCROLL REVEAL OBSERVER
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ============================================================
// LIGHTBOX GALLERY CLICK BINDING
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll("#gallery .g-item");

    galleryItems.forEach((item) => {
        // Find the image element inside the card or pull from data attribute
        const imgElement = item.querySelector("img");
        
        // Use the image's src, or fall back to a data attribute if provided
        const imgSrc = imgElement ? imgElement.src : item.getAttribute("data-src");

        // Click event listener
        item.addEventListener("click", () => {
            if (imgSrc && typeof openLightbox === "function") {
                openLightbox(imgSrc);
            }
        });

        // Accessibility attributes
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");

        // Keyboard navigation support (Enter & Spacebar)
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (imgSrc && typeof openLightbox === "function") {
                    openLightbox(imgSrc);
                }
            }
        });
    });
});

// ============================================================
// 3D SCROLL ENGINE — smooth lerped depth, parallax & tilt
// ============================================================
let currentScrollY = window.scrollY;
let targetScrollY = window.scrollY;
let engineRunning = false;

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateDepthTransforms() {
  if (isReducedMotion) {
    engineRunning = false;
    return;
  }

  // Smoothly ease toward the real scroll position for a buttery feel
  currentScrollY = lerp(currentScrollY, targetScrollY, 0.09);
  if (Math.abs(targetScrollY - currentScrollY) < 0.05) {
    currentScrollY = targetScrollY;
  }

  const vh = window.innerHeight || 1;

  // Navbar + scroll progress bar
  navbar?.classList.toggle("scrolled", currentScrollY > 60);
  if (scrollBar) {
    const docHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scrollBar.style.width = `${(currentScrollY / docHeight) * 100}%`;
  }

  // Hero cinematic depth
  const heroProgress = clamp(currentScrollY / vh, 0, 1);
  if (heroBg) {
    heroBg.style.setProperty("--hero-bg-y", `${currentScrollY * 0.18}px`);
  }
  if (heroOrb1) {
    heroOrb1.style.setProperty("--orb1-y", `${currentScrollY * 0.12}px`);
  }
  if (heroOrb2) {
    heroOrb2.style.setProperty("--orb2-y", `${-currentScrollY * 0.08}px`);
  }
  if (heroOrb3) {
    heroOrb3.style.setProperty("--orb3-y", `${currentScrollY * 0.04}px`);
  }
  if (heroContent) {
    heroContent.style.setProperty("--hero-shift", `${currentScrollY * 0.08}px`);
    heroContent.style.setProperty(
      "--hero-rx",
      `${(heroProgress * -2.2).toFixed(2)}deg`,
    );
  }

  // Section-card dynamic 3D tilt mapping
  const intensityBase = isMobile ? 0.3 : 1.4;

  depthTargets.forEach((target) => {
    const el = target.el;
    if (!el) return;

    const depth = target.depth || 1;
    const rect = el.getBoundingClientRect();

    const elementTopFromDoc = rect.top + window.scrollY;
    const center = elementTopFromDoc - currentScrollY + rect.height / 2;
    const offset = (center - vh / 2) / vh;
    const visible = 1 - clamp(Math.abs(offset) * 1.2, 0, 1);

    const lift = clamp(-offset * 40 * depth * intensityBase, -30, 30);
    const rx = clamp(-offset * 15 * depth * intensityBase, -18, 18);
    const ry = clamp(offset * 10 * depth * intensityBase, -12, 12);
    const scale = 1 + visible * 0.02 * depth;

    el.style.setProperty("--lift", `${lift.toFixed(2)}px`);
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--scale", `${scale.toFixed(3)}`);
  });

  // Gentle section tilt flag for the current viewport
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < vh && rect.bottom > 0;
    section.style.setProperty("--section-depth", inView ? "1" : "0");
  });

  // Keep the loop alive while the eased value is still catching up
  if (Math.abs(targetScrollY - currentScrollY) > 0.05) {
    window.requestAnimationFrame(updateDepthTransforms);
  } else {
    engineRunning = false;
  }
}

function requestEngineUpdate() {
  targetScrollY = window.scrollY;
  if (!engineRunning) {
    engineRunning = true;
    window.requestAnimationFrame(updateDepthTransforms);
  }
}

window.addEventListener("scroll", requestEngineUpdate, { passive: true });
window.addEventListener(
  "resize",
  () => {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    requestEngineUpdate();
  },
  { passive: true },
);

// Kick off the engine once on load so initial positions are correct
requestEngineUpdate();

// ============================================================
// OPTIONAL POINTER TILT FOR DESKTOP HERO
// ============================================================
if (!isReducedMotion && !isMobile) {
  window.addEventListener("pointermove", (e) => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * -1.2;
    const ry = ((e.clientX - cx) / cx) * 1.2;
    heroContent?.style.setProperty("--hero-rx", `${rx.toFixed(2)}deg`);
    heroBg?.style.setProperty(
      "--hero-bg-y",
      `${Math.max(-18, Math.min(18, ry * 6))}px`,
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
    const dots = document.querySelectorAll(".explore-dot");
    const image = document.getElementById("exploreImage");
    const label = document.getElementById("exploreLabel");
    const title = document.getElementById("exploreTitle");
    const desc = document.getElementById("exploreDescription");
    const distance = document.getElementById("exploreDistance");
    const time = document.getElementById("exploreTime");
    const category = document.getElementById("exploreCategory");
    const contentBox = document.querySelector(".explore-content");
    const imageBox = document.querySelector(".explore-image");

    let switchTimer = null;

    dots.forEach(dot => {
        dot.addEventListener("click", function() {
            // Ignore if already active
            if (this.classList.contains("active")) return;

            // Clear any pending image switch timeouts to prevent state lock
            if (switchTimer) clearTimeout(switchTimer);

            // Update active states
            dots.forEach(d => {
                d.classList.remove("active");
                d.setAttribute("aria-selected", "false");
            });

            this.classList.add("active");
            this.setAttribute("aria-selected", "true");

            // Extract data from clicked dot
            const newImg = this.getAttribute("data-image");
            const newLabel = this.getAttribute("data-label");
            const newTitle = this.getAttribute("data-title");
            const newDesc = this.getAttribute("data-desc");
            const newDist = this.getAttribute("data-distance");
            const newTime = this.getAttribute("data-time");
            
            const newCat = this.getAttribute("data-category");


            // Trigger CSS fade out via class on container
            if (imageBox) imageBox.classList.add("fade-out");
            if (contentBox) contentBox.classList.add("fade-anim");

            // Swap data after fade-out completes
            switchTimer = setTimeout(() => {
                // Ensure image inline styles don't conflict with CSS
                if (image) {
                    image.style.opacity = "";
                    image.src = newImg;
                    image.alt = newTitle || "";
                }

                if (label) label.textContent = newLabel;
                if (title) title.textContent = newTitle;
                if (desc) desc.textContent = newDesc;
                if (distance) distance.textContent = newDist;
                if (time) time.textContent = newTime;
                if (category) category.textContent = newCat;

                // Remove fade classes to trigger smooth fade-in
                if (imageBox) imageBox.classList.remove("fade-out");
                if (contentBox) contentBox.classList.remove("fade-anim");
            }, 250);
        });
    });
}); 


// Initialize Lenis for buttery-smooth scrolling
const lenis = new Lenis({
  duration: 1.2, // Kitna slow/smooth scroll chalega (jitna zyada number, utna buttery scroll)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smooth easing
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9, // Wheel scrolling speed controller (kam karoge toh scroll aur slow chalega)
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Optional: Agar aapke paas internal link anchor tag hain (e.g., <a href="#explore">)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.5 // Anchor click scroll speed (slow & luxurious)
      });
    }
  });
});

// ============================================================
// HOME PAGE COUNTER — scroll-triggered count-up (runs once)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const counterSection = document.getElementById("home-counter");
  if (!counterSection) return;

  const counters = counterSection.querySelectorAll("[data-count]");
  if (!counters.length) return;

  let hasAnimated = false;

  const animateCounter = (element) => {
    const target = parseFloat(element.dataset.count, 10);
    const suffix = element.dataset.suffix || "";
    const decimals = parseInt(element.dataset.decimals || "0", 10);
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const displayValue = decimals
        ? current.toFixed(decimals)
        : Math.floor(current).toString();

      element.textContent = `${displayValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || hasAnimated) return;

        hasAnimated = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(counterSection);
});