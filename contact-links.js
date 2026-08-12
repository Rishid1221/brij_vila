/* Shared contact — mobile app deep links, desktop web fallbacks */
(function () {
  const EMAIL = "brijvillajaisalmer@gmail.com";
  const WHATSAPP_PHONE = "918769878788";
  const INSTAGRAM_USERNAME = "brijvilla_jaisalmer";
  const INSTAGRAM_URL =
    "https://www.instagram.com/brijvilla_jaisalmer?igsh=MWw5ZTd3NH1va2M3cA==";
  const FACEBOOK_URL = "https://www.facebook.com/share/1Bj2ftABbc/";
  const ADDRESS =
    "Back Side Bhatia Mukti Dham, Near Parihar Hospital, Geeta Ashram Road, Jaisalmer, Rajasthan - 345001";
  const encodedAddress = encodeURIComponent(ADDRESS);

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = () => /Android/i.test(navigator.userAgent);

  function getContactUrl(type) {
    const mobile = isMobile();

    switch (type) {
      case "whatsapp":
        return mobile
          ? `https://wa.me/${WHATSAPP_PHONE}`
          : `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;

      case "instagram":
        return mobile
          ? `instagram://user?username=${INSTAGRAM_USERNAME}`
          : INSTAGRAM_URL;

      case "facebook":
        return mobile
          ? `fb://facewebmodal/f?href=${encodeURIComponent(FACEBOOK_URL)}`
          : FACEBOOK_URL;

      case "email":
        if (!mobile) {
          return `mailto:${EMAIL}`;
        }
        if (isIOS()) {
          return `googlegmail://co?to=${EMAIL}`;
        }
        if (isAndroid()) {
          return `intent://compose?to=${EMAIL}#Intent;scheme=googlegmail;package=com.google.android.gm;S.browser_fallback_url=mailto:${EMAIL};end`;
        }
        return `mailto:${EMAIL}`;

      case "maps":
        if (!mobile) {
          return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        }
        if (isIOS()) {
          return `comgooglemaps://?q=${encodedAddress}`;
        }
        return `https://maps.google.com/maps?q=${encodedAddress}`;

      default:
        return null;
    }
  }

  function openContactLink(type) {
    const url = getContactUrl(type);
    if (!url) return;

    if (type === "instagram" && isMobile()) {
      window.location.href = url;
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = INSTAGRAM_URL;
        }
      }, 1200);
      return;
    }

    if (type === "facebook" && isMobile()) {
      window.location.href = url;
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = FACEBOOK_URL;
        }
      }, 1200);
      return;
    }

    if (type === "maps" && isMobile() && isIOS()) {
      const webFallback = `https://maps.google.com/maps?q=${encodedAddress}`;
      window.location.href = url;
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = webFallback;
        }
      }, 1200);
      return;
    }

    if (type === "email" && !isMobile()) {
      window.location.href = url;
      return;
    }

    window.location.href = url;
  }

  function openWhatsAppInquiry(message) {
    const encodedText = encodeURIComponent(message);
    const mobile = isMobile();
    const whatsappUrl = mobile
      ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`
      : `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;

    if (mobile) {
      window.location.href = whatsappUrl;
      return true;
    }

    const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    return whatsappWindow !== null;
  }

  function handleConciergeInquiry(event) {
    event.preventDefault();

    const form = document.getElementById("conciergeInquiryForm");
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const inputs = form.querySelectorAll("input");
    const selects = form.querySelectorAll("select");
    const textarea = form.querySelector("textarea");

    const name = inputs[0]?.value.trim() || "";
    const email = inputs[1]?.value.trim() || "";
    const phone = inputs[2]?.value.trim() || "";
    const arrival = inputs[3]?.value || "";
    const inquiryNature = selects[0]?.value || "";
    const guests = selects[1]?.value || "";
    const specialRequests = textarea?.value.trim() || "";

    const lines = [
      "New Inquiry",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      inquiryNature ? `Inquiry: ${inquiryNature}` : "",
      arrival ? `Arrival: ${arrival}` : "",
      guests ? `Guests: ${guests}` : "",
      specialRequests ? `Special Requests: ${specialRequests}` : "",
    ].filter(Boolean);

    if (openWhatsAppInquiry(lines.join("\n"))) {
      form.reset();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const inquiryForm = document.getElementById("conciergeInquiryForm");
    inquiryForm?.addEventListener("submit", handleConciergeInquiry);

    document.querySelectorAll(".contact-app-link").forEach((link) => {
      const type = link.dataset.contact;
      if (!type) return;

      const url = getContactUrl(type);
      if (url) {
        link.setAttribute("href", url);
      }

      link.addEventListener("click", (event) => {
        event.preventDefault();
        openContactLink(type);
      });
    });
  });
})();
