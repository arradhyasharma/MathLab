const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

function getPreferredTheme() {
  const savedTheme = localStorage.getItem("mathlab-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀" : "◐";
  }

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  }
}

// Apply the saved or preferred theme when the page loads.
applyTheme(getPreferredTheme());

// Switch between light and dark themes.
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("mathlab-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

// Open and close the mobile sidebar.
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "Close" : "Menu";
  });

  // Close the sidebar after selecting a link on mobile.
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "Menu";
    });
  });
}
