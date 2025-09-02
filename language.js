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
  // Get current URL
  let url = window.location.href;

  // Determine target language
  let targetLang = (currentLang === "es") ? "en" : "es";
  localStorage.setItem("lang", targetLang);
  currentLang = targetLang;

  // Replace '/en/' with '.es.' or vice versa
  if (url.includes(".en.")) {
    url = url.replace(".en.", ".es.");
  } else if (url.includes(".es.")) {
    if (url.includes("index.es.html")){
        url = url.replace(".es.", ".");
    }
    else{
        url = url.replace(".es.", ".en.");
    }
  } else {
    // If at top-level (no .en. or .es.), default to targetLang folder
    let parts = url.split('.');
    parts.splice(parts.length - 1, 0, "es"); // insert before last element
    url = parts.join('.');
  }

  // Navigate to the new URL
  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
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
