/* ==========================================================
   Brij VILLA ROOMS
   Sticky Scroll + Active Navigation (desktop)
   Mobile carousel with Previous / Next controls
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const roomSections = document.querySelectorAll(".room-showcase");
    const navButtons = document.querySelectorAll(".room-nav-item");
    const track = document.getElementById("homeRoomsTrack");
    const prevBtn = document.getElementById("homeRoomPrev");
    const nextBtn = document.getElementById("homeRoomNext");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    if (!roomSections.length) return;

    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let scrollObserver = null;

    const isMobile = () => mobileQuery.matches;

    const updateNavActive = (sectionId) => {
        navButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.room === sectionId);
        });
    };

    const updateSliderButtons = () => {
        if (!prevBtn || !nextBtn) return;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === roomSections.length - 1;
    };

    const goToSlide = (index, { animate = true } = {}) => {
        if (!track || !isMobile()) return;

        currentIndex = Math.max(0, Math.min(index, roomSections.length - 1));

        if (!animate) {
            track.style.transition = "none";
        }

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        if (!animate) {
            track.offsetHeight;
            track.style.transition = "";
        }

        updateNavActive(roomSections[currentIndex].id);
        updateSliderButtons();
    };

    const initScrollObserver = () => {
        if (scrollObserver) return;

        scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    updateNavActive(entry.target.id);
                    entry.target.classList.add("active-room");
                });
            },
            { threshold: 0.55 }
        );

        roomSections.forEach((section) => scrollObserver.observe(section));
    };

    const destroyScrollObserver = () => {
        if (!scrollObserver) return;

        scrollObserver.disconnect();
        scrollObserver = null;
    };

    const initMobileSlider = () => {
        destroyScrollObserver();

        if (track) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        updateNavActive(roomSections[currentIndex].id);
        updateSliderButtons();
    };

    const destroyMobileSlider = () => {
        if (track) {
            track.style.transform = "";
        }

        initScrollObserver();
    };

    const handleViewportChange = () => {
        if (isMobile()) {
            initMobileSlider();
        } else {
            destroyMobileSlider();
        }
    };

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.room;
            const targetIndex = [...roomSections].findIndex(
                (section) => section.id === targetId
            );

            if (targetIndex < 0) return;

            if (isMobile()) {
                goToSlide(targetIndex);
                return;
            }

            const target = document.getElementById(targetId);
            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    prevBtn?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn?.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
    });

    track?.addEventListener(
        "touchstart",
        (event) => {
            if (!isMobile()) return;

            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        },
        { passive: true }
    );

    track?.addEventListener(
        "touchend",
        (event) => {
            if (!isMobile()) return;

            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
                return;
            }

            goToSlide(currentIndex + (deltaX > 0 ? 1 : -1));
        },
        { passive: true }
    );

    mobileQuery.addEventListener("change", handleViewportChange);
    handleViewportChange();

    window.addEventListener("scroll", () => {
        if (isMobile()) return;

        roomSections.forEach((section) => {
            const img = section.querySelector("img");
            if (!img) return;

            const rect = section.getBoundingClientRect();
            const offset = rect.top * -0.05;

            img.style.transform = `translateY(${offset}px) scale(1.05)`;
        });
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll(".room-content").forEach((card) => {
        revealObserver.observe(card);
    });

});
