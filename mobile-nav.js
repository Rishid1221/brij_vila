(function () {
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  const navClose = document.getElementById("navClose");
  const mobLinks = document.querySelectorAll(".mob-link");

  if (!hamburger || !mobileNav) return;

  function openMobileNav() {
    mobileNav.classList.add("open");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) closeMobileNav();
    else openMobileNav();
  });

  navClose?.addEventListener("click", closeMobileNav);
  mobLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
})();
