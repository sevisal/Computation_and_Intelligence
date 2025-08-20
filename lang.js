<script>
let currentLang = localStorage.getItem("lang") || "en";

function qs(sel) { return document.querySelector(sel); }

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);  // ✅ save preference


  // 1) Mostrar/ocultar bloques de contenido
  document.querySelectorAll(".lang").forEach(el => {
    el.style.display = el.classList.contains(currentLang) ? "block" : "none";
  });

  // 2) Actualizar el toggle 🌐 (el de navbar con href="javascript:void(0)")
  const switcher = qs("a[href='javascript:void(0)']");
  if (switcher) {
    switcher.textContent = (currentLang === "es") ? "🌐 English" : "🌐 Español";
    switcher.style.cursor = "pointer";
  }

  // 3) HOME: primer item del grupo izquierdo (me-auto) → primer <a>
  // Quarto usa Bootstrap: ul.navbar-nav.me-auto para la izquierda y .ms-auto para la derecha
  let homeLink =
    qs(".navbar .navbar-nav.me-auto > li.nav-item:nth-child(1) > a.nav-link") ||
    qs(".navbar .navbar-nav:not(.ms-auto) > li.nav-item:nth-child(1) > a"); // fallback
  if (homeLink) {
    homeLink.textContent = (currentLang === "es") ? "🏠 Inicio" : "🏠 Home";
  }

  // 4) LABS (etiqueta del dropdown): segundo item del grupo izquierdo
  let labsToggle =
    qs(".navbar .navbar-nav.me-auto > li:nth-child(2) > a[data-bs-toggle='dropdown']") ||
    qs(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(2) > a[data-bs-toggle='dropdown']") ||
    qs(".navbar .navbar-nav.me-auto > li:nth-child(2) > a.nav-link") ||
    qs(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(2) > a.nav-link");
  if (labsToggle) {
    labsToggle.textContent = (currentLang === "es") ? "Laboratorios" : "Labs";
  }

  // 5) LAB 1 (dentro del dropdown): busca por final de URL en html/dir
  let lab1Item =
    qs(".navbar .dropdown-menu a[href$='lab1.html']") ||
    qs(".navbar .dropdown-menu a[href$='lab1/']") ||
    qs(".navbar .dropdown-menu a[href$='lab1']");
  if (lab1Item) {
    lab1Item.textContent = (currentLang === "es") ? "Laboratorio 1" : "Lab 1";
  }

  // (Opcional) Título clickable (brand)
  const brand = qs(".navbar-brand");
  if (brand) {
    brand.textContent = (currentLang === "es")
      ? "Computación e Inteligencia"
      : "Computation and Intelligence";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);

  const switcher = document.querySelector("a[href='javascript:void(0)']");
  if (switcher) {
    switcher.addEventListener("click", (e) => {
      e.preventDefault();
      setLanguage(currentLang === "es" ? "en" : "es");
    });
  }
});
</script>
