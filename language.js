<script>
let currentLang = localStorage.getItem("lang") || "en";

// Map navbar & page labels for both languages
const navbarLabels = {
  en: {
    title: "Computation and Intelligence",
    home: "🏠 Home",
    labs: "🔬 Labs",
    labItems: [
      "Lab 1", "Lab 2", "Lab 3", "Lab 4", "Lab 5", "Lab 6", "Lab 7"
    ]
  },
  es: {
    title: "Computación e Inteligencia",
    home: "🏠 Inicio",
    labs: "🔬 Laboratorios",
    labItems: [
      "Laboratorio 1", "Laboratorio 2", "Laboratorio 3", "Laboratorio 4",
      "Laboratorio 5", "Laboratorio 6", "Laboratorio 7"
    ]
  }
};
// Update navbar text
function updateNavbarText(lang) {

  // Update page title
  document.title = navbarLabels[lang].title;
  
  // Brand (if exists)
  const brand = document.querySelector(".navbar-brand");
  if (brand) brand.textContent = navbarLabels[lang].title;
  
  // Home link
  const homeLink =
    document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(1) > a") ||
    document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(1) > a");
  if (homeLink) homeLink.textContent = navbarLabels[lang].home;

  // Labs dropdown
  const labsToggle =
    document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(2) > a[data-bs-toggle='dropdown']") ||
    document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(2) > a[data-bs-toggle='dropdown']");
  if (labsToggle) labsToggle.textContent = navbarLabels[lang].labs;

  // Labs dropdown items
  const labLinks = document.querySelectorAll(".navbar .dropdown-menu a.nav-link");
  labLinks.forEach((link, i) => {
    if (navbarLabels[lang].labItems[i]) {
      link.textContent = navbarLabels[lang].labItems[i];
    }
  });
}

function switchLang() {
  let url = window.location.href;
  let targetLang = (currentLang === "es") ? "en" : "es";
  localStorage.setItem("lang", targetLang);
  currentLang = targetLang;

  // Handle index page separately
  if (url.endsWith("/") || url.endsWith("index.html")) {
    if (targetLang === "es") {
      url = url.replace("index.html", "index.es.html");
    }
  } else if (url.endsWith("index.es.html")) {
    if (targetLang === "en") {
      url = url.replace("index.es.html", "index.html");
    }
  }
  // Handle other pages: lab1.html <-> lab1.es.html
  else if (url.includes(".es.html")) {
    if (targetLang === "en") {
      url = url.replace(".es.html", ".html");
    }
  } else if (url.endsWith(".html")) {
    if (targetLang === "es") {
      url = url.replace(".html", ".es.html");
    }
  }

  window.location.href = url;
}


document.addEventListener("DOMContentLoaded", () => {
  // If landing on project root without .html, redirect based on saved lang
  if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/Computation_and_Intelligence/")) {
    let saved = localStorage.getItem("lang") || "en";
    if (saved === "es") {
      window.location.href = "index.es.html";
    } else {
      window.location.href = "index.html";
    }
  }

  updateNavbarText(currentLang);

  const switcher = document.querySelector("a[href='javascript:void(0)']");
  if (switcher) {
    switcher.style.cursor = "pointer";
    switcher.addEventListener("click", (e) => {
      e.preventDefault();
      switchLang();
    });
  }
});

</script>
