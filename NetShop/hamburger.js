// ======================================================================
// RESPONSIVE NAVIGATION HANDLER
// Works with the CSS you posted (hamburger + dropdowns)
// Save as: responsive-nav.js
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  const body = document.body;

  // Create overlay (matches your CSS)
  let overlay = document.querySelector(".nav-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("nav-overlay");
    document.body.appendChild(overlay);
  }

  // Toggle mobile menu
  const toggleMenu = () => {
    const isOpen = nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
    overlay.classList.toggle("active");
    body.classList.toggle("menu-open");
  };

  // Close menu fully
  const closeMenu = () => {
    nav.classList.remove("active");
    menuToggle.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");
  };

  // Toggle on hamburger click
  menuToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close on overlay click
  overlay.addEventListener("click", closeMenu);

  // Close after clicking any nav link
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setTimeout(closeMenu, 150))
  );

  // Mobile dropdown logic
  const dropdowns = nav.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-link");

    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 767) {
        e.preventDefault();

        // Close other open dropdowns
        dropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove("open");
        });

        dropdown.classList.toggle("open");
      }
    });
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
