﻿﻿﻿// ===================== Global Image Error Handler =====================
const applyImageFallback = (img) => {
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = "images/placeholder.svg";
  img.alt = "Image unavailable";
};

document.addEventListener("error", (e) => {
  if (e.target.tagName.toLowerCase() === "img") {
    applyImageFallback(e.target);
  }
}, true);

// Catch images that failed before the error listener attached
window.addEventListener("load", () => {
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      applyImageFallback(img);
    }
  });
});

// ===================== Active Navigation Link =====================
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(link => {
  const isActive = link.getAttribute("href") === currentPage;
  link.classList.toggle("active", isActive);
  if (isActive) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

// ===================== Dark Mode =====================
const toggle = document.getElementById("darkToggle");
const updateToggleState = (isDark) => {
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  toggle.setAttribute("title", isDark ? "Disable dark mode" : "Enable dark mode");
};

if (toggle) {
  toggle.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", nextState);
    localStorage.setItem("darkMode", nextState ? "enabled" : "disabled");
    updateToggleState(nextState);
  });
}

const storedDarkMode = localStorage.getItem("darkMode");
const isDark = storedDarkMode === "enabled";
if (isDark) {
  document.body.classList.add("dark");
}
updateToggleState(isDark);

// ===================== Scroll Reveal =====================
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if(top < windowHeight - 100){
      el.classList.add("show");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
revealOnScroll(); // Trigger immediately to show visible elements

// ===================== Reading Progress =====================
const progressBar = document.querySelector(".reading-progress span");
if (progressBar) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateProgress);
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

// ===================== Section Highlighting =====================
const tocLinks = document.querySelectorAll(".toc a[data-target]");
const tocTargets = Array.from(tocLinks)
  .map(link => document.getElementById(link.dataset.target))
  .filter(Boolean);

if (tocLinks.length && tocTargets.length) {
  const activateLink = (id) => {
    tocLinks.forEach(link => {
      const isActive = link.dataset.target === id;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateLink(entry.target.id);
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

  tocTargets.forEach(section => observer.observe(section));
}

// ===================== Search Articles (Homepage) =====================
const searchBar = document.getElementById("searchBar");
if(searchBar){
  const posts = document.querySelectorAll(".post");
  const postsContainer = document.querySelector(".posts");

  // Create "No Results" message dynamically
  const noResultsMsg = document.createElement("div");
  noResultsMsg.className = "no-results";
  noResultsMsg.textContent = "No articles found matching your search.";
  noResultsMsg.style.display = "none";
  noResultsMsg.setAttribute("role", "status");
  noResultsMsg.setAttribute("aria-live", "polite");
  if(postsContainer) postsContainer.appendChild(noResultsMsg);

  searchBar.addEventListener("input", () => {
    const value = searchBar.value.toLowerCase();
    let visibleCount = 0;

    posts.forEach(post => {
      const isVisible = post.innerText.toLowerCase().includes(value);
      post.style.display = isVisible ? "block" : "none";
      if(isVisible) visibleCount++;
    });
    
    noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
  });
}

// ===================== Mouse Spotlight Effect =====================
document.querySelectorAll('.post').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
