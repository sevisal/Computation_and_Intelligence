<script>
/* language.js — dedupe-safe version
   If you include this as an external .js file, remove the <script> wrappers.
*/

let currentLang = localStorage.getItem("lang") || "en";

// keep your existing labels object (trimmed here for brevity — keep your full object)
const navbarLabels = {
  en: {
    title: "Computation and Intelligence",
    home: "🏠 Home",
    labs: "🔬 Labs",
    labItems: ["Lab 1","Lab 2","Lab 3","Lab 4","Lab 5","Lab 6","Lab 7"],
    setup: "🔧 Setup"
  },
  es: {
    title: "Computación e Inteligencia",
    home: "🏠 Inicio",
    labs: "🔬 Laboratorios",
    labItems: ["Laboratorio 1","Laboratorio 2","Laboratorio 3","Laboratorio 4","Laboratorio 5","Laboratorio 6","Laboratorio 7"],
    setup: "🔧 Configuración"
  }
};

// --- helper: consolidate/remove duplicate .navbar-brand elements ---
function consolidateBrand() {
  const brands = Array.from(document.querySelectorAll(".navbar-brand"));
  if (brands.length <= 1) return brands[0] || null;

  // Prefer the brand that contains an <img>, otherwise prefer the one with longest text
  let preferred = brands.find(b => b.querySelector("img")) ||
                  brands.reduce((a,b) => ( (a.textContent || "").length >= (b.textContent || "").length ? a : b ));

  // If any duplicate has useful href and preferred doesn't, copy it
  brands.forEach((b) => {
    if (b === preferred) return;
    try {
      if (!preferred.getAttribute("href") && b.getAttribute("href")) {
        preferred.setAttribute("href", b.getAttribute("href"));
      }
      // Remove duplicate from DOM
      b.remove();
    } catch (e) {
      // ignore removal errors
      console.warn("brand dedupe: couldn't remove a duplicate", e);
    }
  });

  return preferred;
}

// Watch for later DOM changes that might re-insert duplicates (Quarto or other scripts)
function observeBrandDedupe() {
  const root = document.querySelector("nav") || document.body;
  if (!root) return;
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        // If any added node contains .navbar-brand, run consolidation
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches(".navbar-brand")) {
            consolidateBrand();
            return;
          }
          if (node.querySelector && node.querySelector(".navbar-brand")) {
            consolidateBrand();
            return;
          }
        }
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
}

// --- update functions (use consolidated brand) ---
function updateNavbarText(lang) {
  document.title = navbarLabels[lang].title;

  // Ensure single brand element
  const brand = consolidateBrand() || document.querySelector(".navbar-brand");
  if (brand) {
    const img = brand.querySelector("img");
    if (img) {
      img.alt = navbarLabels[lang].title;
    } else {
      brand.textContent = navbarLabels[lang].title;
    }
  }

  // Home link
  const homeLink =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(1) > a") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(1) > a");
  if (homeLink) homeLink.textContent = navbarLabels[lang].home;

  // Setup link
  const setupLink =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(2) > a") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(2) > a");
  if (setupLink) setupLink.textContent = navbarLabels[lang].setup;

  // Labs dropdown toggle
  const labsToggle =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(3) > a[data-bs-toggle='dropdown']") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(3) > a[data-bs-toggle='dropdown']");
  if (labsToggle) labsToggle.textContent = navbarLabels[lang].labs;

  // Labs dropdown items
  const labLinks = document.querySelectorAll(".navbar .dropdown-menu a.dropdown-item");
  labLinks.forEach((link, i) => {
    if (navbarLabels[lang].labItems[i]) {
      link.textContent = navbarLabels[lang].labItems[i];
    }
  });
}

function updatedURL(lang, url) {
  if (url.endsWith("/") || url.endsWith("index.html")) {
    if (lang === "es") url = url.replace("index.html", "index.es.html");
    else if (url.endsWith("index.es.html")) url = url.replace("index.es.html", "index.html");
  } else if (url.includes(".es.html")) {
    if (lang === "en") url = url.replace(".es.html", ".html");
  } else if (url.endsWith(".html")) {
    if (lang === "es") url = url.replace(".html", ".es.html");
  }
  return url;
}

function updateNavbarHref(lang) {
  const brand = consolidateBrand() || document.querySelector(".navbar-brand");
  if (brand) {
    let href = brand.getAttribute("href");
    if (href) brand.setAttribute("href", updatedURL(lang, href));
  }

  const homeLink =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(1) > a") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(1) > a");
  if (homeLink) {
    let href = homeLink.getAttribute("href");
    if (href) homeLink.setAttribute("href", updatedURL(lang, href));
  }

  const setupLink =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(2) > a") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(2) > a");
  if (setupLink) {
    let href = setupLink.getAttribute("href");
    if (href) setupLink.setAttribute("href", updatedURL(lang, href));
  }

  const labsToggle =
      document.querySelector(".navbar .navbar-nav.me-auto > li:nth-child(3) > a[data-bs-toggle='dropdown']") ||
      document.querySelector(".navbar .navbar-nav:not(.ms-auto) > li:nth-child(3) > a[data-bs-toggle='dropdown']");
  if (labsToggle) {
    let href = labsToggle.getAttribute("href");
    if (href) labsToggle.setAttribute("href", updatedURL(lang, href));
  }

  const labLinks = document.querySelectorAll(".navbar .dropdown-menu a.dropdown-item");
  labLinks.forEach((link) => {
    let href = link.getAttribute("href");
    if (href) link.setAttribute("href", updatedURL(lang, href));
  });
}

function switchLang() {
  let url = window.location.href;
  let hash = window.location.hash;
  let targetLang = (currentLang === "es") ? "en" : "es";
  localStorage.setItem("lang", targetLang);
  currentLang = targetLang;
  url = url.replace(hash, "");
  if (url.endsWith("/") || url.endsWith("index.html")) {
    if (targetLang === "es") url = url.replace("index.html", "index.es.html");
  } else if (url.endsWith("index.es.html")) {
    if (targetLang === "en") url = url.replace("index.es.html", "index.html");
  } else if (url.includes(".es.html")) {
    if (targetLang === "en") url = url.replace(".es.html", ".html");
  } else if (url.endsWith(".html")) {
    if (targetLang === "es") url = url.replace(".html", ".es.html");
  }
  window.location.href = url + hash;
}

document.addEventListener("DOMContentLoaded", () => {
  // First dedupe immediately
  consolidateBrand();

  // Observe for later re-renders
  observeBrandDedupe();

  updateNavbarText(currentLang);
  updateNavbarHref(currentLang);

  const switcher = document.querySelector("a[href='javascript:void(0)']");
  if (switcher) {
    switcher.style.cursor = "pointer";
    switcher.addEventListener("click", (e) => {
      e.preventDefault();
      switchLang();
    });
  }

  // If root, redirect to saved language
  if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/Computation_and_Intelligence/")) {
    let saved = localStorage.getItem("lang") || "en";
    if (saved === "es") window.location.href = "index.es.html";
    else window.location.href = "index.html";
  }
});
</script>
