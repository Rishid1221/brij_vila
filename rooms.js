/* ==========================================================
   Brij VILLA ROOMS
   Sticky Scroll + Active Navigation
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const roomSections = document.querySelectorAll(".room-showcase");
    const navButtons = document.querySelectorAll(".room-nav-item");

    if (!roomSections.length) return;

    /* -----------------------------
       ACTIVE ROOM ON SCROLL
    ----------------------------- */

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navButtons.forEach((btn) => {

                    btn.classList.remove("active");

                    if (btn.dataset.room === currentId) {
                        btn.classList.add("active");
                    }

                });

                entry.target.classList.add("active-room");

            });

        },
        {
            threshold: 0.55
        }
    );

    roomSections.forEach(section => observer.observe(section));



    /* -----------------------------
       NAVIGATION CLICK
    ----------------------------- */

    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            const target = document.getElementById(button.dataset.room);

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });



    /* -----------------------------
       IMAGE PARALLAX
    ----------------------------- */

    window.addEventListener("scroll", () => {

        roomSections.forEach(section => {

            const img = section.querySelector("img");

            if (!img) return;

            const rect = section.getBoundingClientRect();

            const offset = rect.top * -0.05;

            img.style.transform = `translateY(${offset}px) scale(1.05)`;

        });

    });



    /* -----------------------------
       FADE IN CONTENT
    ----------------------------- */

    const revealObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: .2
        }

    );

    document.querySelectorAll(".room-content").forEach(card => {

        revealObserver.observe(card);

    });

});