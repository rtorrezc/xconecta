// ===============================
// DATOS EDITABLES DE LA INVITACIÓN
// ===============================
const CONFIG = {
  eventName: "Encuentro Nacional Yankee Boys 2026",
  // Ajusta la hora real del evento. Formato: AAAA-MM-DDTHH:MM:SS-04:00
  startDate: "2026-08-06T18:00:00-04:00",
  endDate: "2026-08-07T23:00:00-04:00",

  // Reemplaza por el número real, sin +, espacios ni guiones.
  whatsappNumber: "59168496215",
  whatsappMessage: "Hola, confirmo mi asistencia al Encuentro Nacional Yankee Boys 2026.",

  // Reemplaza por el enlace exacto de Google Maps cuando tengas el lugar.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cochabamba%2C%20Boliviahttps://maps.app.goo.gl/qEozThLDQhJdsm6Q6",

  locationText: "Salón de Eventos Dubai",
  description: "Encuentro Nacional Yankee Boys, 6 y 7 de agosto de 2026."
};

const $ = (id) => document.getElementById(id);

function updateCountdown() {
  const eventTime = new Date(CONFIG.startDate).getTime();
  const now = Date.now();
  const distance = eventTime - now;

  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => $(id).textContent = "00");
    $("event-message").textContent = "¡El encuentro ya comenzó!";
    return;
  }

  $("days").textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  $("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  $("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  $("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

function setupLinks() {
  const wa = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  $("whatsapp-btn").href = wa;
  $("maps-btn").href = CONFIG.mapsUrl;
}

function formatCalendarDate(dateString) {
  return new Date(dateString).toISOString().replace(/[-:]/g, "").replace(/\.000/, "");
}

function downloadCalendarEvent() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yankee Boys Bolivia//Invitacion 2026//ES",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@yankeeboys`,
    `DTSTAMP:${formatCalendarDate(new Date().toISOString())}`,
    `DTSTART:${formatCalendarDate(CONFIG.startDate)}`,
    `DTEND:${formatCalendarDate(CONFIG.endDate)}`,
    `SUMMARY:${CONFIG.eventName}`,
    `DESCRIPTION:${CONFIG.description}`,
    `LOCATION:${CONFIG.locationText}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Encuentro-Yankee-Boys-2026.ics";
  link.click();
  URL.revokeObjectURL(url);
}

async function shareInvitation() {
  const shareData = {
    title: CONFIG.eventName,
    text: "Te invitamos al Encuentro Nacional Yankee Boys 2026 en Cochabamba.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado.");
    }
  } catch (error) {
    console.log("Compartir cancelado.", error);
  }
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function launchConfetti() {
  const container = document.querySelector(".confetti");
  const colors = ["#f1b941", "#ffffff", "#b71f1f", "#1b67aa"];
  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${4 + Math.random() * 5}s`;
    piece.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 11000);
  }
}

setupLinks();
updateCountdown();
setInterval(updateCountdown, 1000);
$("calendar-btn").addEventListener("click", downloadCalendarEvent);
$("share-btn").addEventListener("click", shareInvitation);
revealOnScroll();
setTimeout(launchConfetti, 650);
