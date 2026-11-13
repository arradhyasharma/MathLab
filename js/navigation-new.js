
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

    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${nextTheme} theme`
    );

    themeToggle.setAttribute(
      "title",
      `Switch to ${nextTheme} theme`
    );
  }
}

/* Apply saved or preferred theme. */
applyTheme(getPreferredTheme());

/* Theme switching. */
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("mathlab-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

/* Mobile sidebar navigation. */
function closeSidebar() {
  if (!sidebar || !menuToggle) return;

  sidebar.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.textContent = "Menu";
}

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.textContent = isOpen ? "Close" : "Menu";
  });

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });
}
