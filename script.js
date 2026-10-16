"use strict";

/* ==========================================
   YUVRAJ PATEL — PORTFOLIO INTERACTIONS
========================================== */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Footer year */
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* 2. Theme toggle */
  const themeButton = document.getElementById("themeToggle");
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeButton) {
      const isDark = theme === "dark";
      themeButton.textContent = isDark ? "☀️" : "☾";
      themeButton.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      themeButton.title = isDark ? "Switch to light theme" : "Switch to dark theme";
    }
  }

  let savedTheme = "dark";

  try {
    const storedTheme = localStorage.getItem("portfolio-theme");

    if (storedTheme === "dark" || storedTheme === "light") {
      savedTheme = storedTheme;
    }
  } catch (error) {
    // The default dark theme still works if storage is unavailable.
  }

  setTheme(savedTheme);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      setTheme(nextTheme);

      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // Theme switching still works for the current page.
      }
    });
  }

  /* 3. Mobile navigation */
  const menuButton = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuButton || !navLinks) return;

    navLinks.classList.remove("open");
    menuButton.textContent = "☰";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.textContent = isOpen ? "✕" : "☰";
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) closeMenu();
    });
  }

  /* 4. Scroll reveal animation */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* 5. Scroll progress bar */
  const progressBar = document.getElementById("scrollProgress");

  /* 6. Back-to-top button */
  const backToTop = document.getElementById("backToTop");

  /* 7. Active navigation section */
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
      const percentage =
        pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

      progressBar.style.width = ${Math.min(100, percentage)}%;
    }

    if (backToTop) {
      backToTop.classList.toggle("show", scrollTop > 400);
    }

    let currentSection = "home";

    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 150) {
        currentSection = section.id;
      }
    });

    navItems.forEach((link) => {
      const isActive = link.getAttribute("href") === #${currentSection};

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(() => {
        updateOnScroll();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  updateOnScroll();

  /* 8. Back-to-top action */
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }

  /* 9. Smooth internal navigation fallback */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (targetId === "#home") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        history.replaceState(null, "", targetId);
      }
    });
  });

  console.log("✨ Yuvraj's portfolio loaded successfully!");
});