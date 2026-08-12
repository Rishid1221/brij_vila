(function initAboutExperiences() {
  const WHATSAPP_PHONE = "918769878788";

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  function openExperienceWhatsApp(serviceName) {
    const message = `Hello Hotel Brij Villa, I would like to book/inquire about ${serviceName}.`;
    const encodedText = encodeURIComponent(message);
    const mobile = isMobile();
    const whatsappUrl = mobile
      ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`
      : `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;

    if (mobile) {
      window.location.href = whatsappUrl;
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  document.querySelectorAll(".experience-book-btn[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const serviceName = button.getAttribute("data-service");
      if (serviceName) {
        openExperienceWhatsApp(serviceName);
      }
    });
  });
})();
