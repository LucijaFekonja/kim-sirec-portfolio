const scrollContainer = document.getElementById("scrollContainer");
const viewer = document.getElementById("viewer");
const titleContainer = document.getElementById("viewer-title-container");
const cursor = document.getElementById("cursor");
const footer = document.querySelector(".footer");
const scrollHint = document.getElementById("scrollHint");
const headerInner = document.querySelector(".header-inner");
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");

const mobileInfoBtn = document.getElementById("mobileInfoBtn");
const pageTransitionCircle = document.getElementById("pageTransitionCircle");
const contactTransitionOverlay = document.getElementById("contactTransitionOverlay");

const contactCloseBtn = document.querySelector(".contact-x");
const pageTransitionCircleReverse = document.getElementById("pageTransitionCircleReverse");
const contactTransitionOverlayReverse = document.getElementById("contactTransitionOverlayReverse");

const isGalleryPage = Boolean(scrollContainer && viewer && titleContainer);
const isContactPage = Boolean(document.querySelector(".contact-page") && !isGalleryPage);

let currentIndex = 0;
let currentImages = [];
let currentCardSync = null;
let viewerTrack = null;
let touchStartX = 0;
let touchStartY = 0;

function isMobileViewport() {
  return window.innerWidth <= 768;
}

// --------------------
// LOADER
// --------------------
function showLoader() {
  if (loader) loader.classList.add("active");
}

function hideLoader() {
  if (loader) {
    if (loaderBar) loaderBar.style.width = "100%";
    window.setTimeout(() => {
      loader.classList.remove("active");
    }, 120);
  }
}

// --------------------
// CUSTOM CURSOR
// --------------------
function setupCursor() {
  if (!cursor || isMobileViewport()) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const interactiveSelector =
    ".project-card, .viewer-arrow, a, button, .header-inner, .img-dot, .contact-x";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add("hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove("hovering");
    }
  });
}

// --------------------
// CONTACT LINK DESKTOP
// --------------------
function setupContactLink() {
  if (!headerInner) return;

  const goToContact = () => {
    if (isMobileViewport()) return;
    window.location.href = "contact.html";
  };

  headerInner.addEventListener("click", goToContact);
  headerInner.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToContact();
    }
  });
}

// --------------------
// VIEWER
// --------------------
function updateViewerSlide() {
  if (!viewerTrack) return;

  const slides = viewerTrack.querySelectorAll(".viewer-slide");

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentIndex);
  });

  const leftArrow = viewer.querySelector(".viewer-arrow.left");
  const rightArrow = viewer.querySelector(".viewer-arrow.right");

  if (leftArrow) {
    leftArrow.style.opacity = currentIndex === 0 ? "0" : "1";
    leftArrow.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
  }

  if (rightArrow) {
    const isLast = currentIndex === currentImages.length - 1;
    rightArrow.style.opacity = isLast ? "0" : "1";
    rightArrow.style.pointerEvents = isLast ? "none" : "auto";
  }
}

function nextSlide() {
  if (currentIndex < currentImages.length - 1) {
    currentIndex += 1;
    updateViewerSlide();
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    updateViewerSlide();
  }
}

function openProject(project, startIndex = 0, onClose = null) {
  if (!viewer || !titleContainer) return;

  currentImages = Array.isArray(project.images) ? project.images : [];
  currentIndex = startIndex;
  currentCardSync = onClose;

  viewer.innerHTML = "";
  viewer.classList.add("active");
  document.body.classList.add("viewer-open");

  if (!history.state || !history.state.viewerOpen) {
    history.pushState({ viewerOpen: true }, "");
  }

  viewerTrack = document.createElement("div");
  viewerTrack.classList.add("viewer-track");

  currentImages.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.classList.add("viewer-slide");
    if (index === currentIndex) slide.classList.add("active");

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${project.name} image ${index + 1}`;

    slide.appendChild(img);
    viewerTrack.appendChild(slide);
  });

  viewer.appendChild(viewerTrack);

  const leftArrow = document.createElement("button");
  leftArrow.className = "viewer-arrow left";
  leftArrow.type = "button";
  leftArrow.setAttribute("aria-label", "Previous image");
  leftArrow.innerHTML = "&#8249;";
  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    prevSlide();
  });

  const rightArrow = document.createElement("button");
  rightArrow.className = "viewer-arrow right";
  rightArrow.type = "button";
  rightArrow.setAttribute("aria-label", "Next image");
  rightArrow.innerHTML = "&#8250;";
  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    nextSlide();
  });

  viewer.appendChild(leftArrow);
  viewer.appendChild(rightArrow);

  titleContainer.innerHTML = `
    <div class="viewer-title-line1">
      ${project.name}${project.location ? `, ${project.location}` : ""}
    </div>
    <div class="viewer-title-line2">
      ${project.author || ""}
    </div>
  `;
  titleContainer.classList.add("active");

  updateViewerSlide();
}

function forceCloseViewer() {
  if (!viewer || !titleContainer) return;

  if (currentCardSync) {
    currentCardSync(currentIndex);
    currentCardSync = null;
  }

  viewer.classList.remove("active");
  viewer.innerHTML = "";
  titleContainer.innerHTML = "";
  titleContainer.classList.remove("active");
  viewerTrack = null;
  currentImages = [];
  currentIndex = 0;
  document.body.classList.remove("viewer-open");
}

function closeViewer() {
  if (history.state?.viewerOpen) {
    history.back();
    return;
  }
  forceCloseViewer();
}

window.addEventListener("popstate", () => {
  if (viewer && viewer.classList.contains("active")) {
    forceCloseViewer();
  }
});

function setupViewerInteractions() {
  if (!viewer) return;

  viewer.addEventListener("click", (e) => {
    if (!e.target.closest(".viewer-slide img") && !e.target.closest(".viewer-arrow")) {
      closeViewer();
    }
  });

  viewer.addEventListener(
    "touchstart",
    (e) => {
      if (!isMobileViewport()) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  viewer.addEventListener(
    "touchend",
    (e) => {
      if (!viewer.classList.contains("active") || !isMobileViewport()) return;

      const touch = e.changedTouches[0];
      const diffX = touchStartX - touch.clientX;
      const diffY = touchStartY - touch.clientY;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      const threshold = 40;

      if (diffY > threshold && absY > absX) {
        closeViewer();
        return;
      }

      if (absX > absY && absX > threshold) {
        if (diffX > 0) nextSlide();
        else prevSlide();
      }
    },
    { passive: true }
  );

  viewer.addEventListener(
    "wheel",
    (e) => {
      if (!viewer.classList.contains("active")) return;

      e.preventDefault();

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 20) nextSlide();
        else if (e.deltaX < -20) prevSlide();
      } else if (!isMobileViewport()) {
        if (e.deltaY > 20) nextSlide();
        else if (e.deltaY < -20) prevSlide();
      }
    },
    { passive: false }
  );
}

// --------------------
// KEYBOARD
// --------------------
document.addEventListener("keydown", (e) => {
  if (viewer && viewer.classList.contains("active")) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextSlide();
      return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeViewer();
      return;
    }
  }

  if (!isGalleryPage || isMobileViewport()) return;
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

  e.preventDefault();

  const pageHeight = window.innerHeight;
  const current = scrollContainer.scrollTop;
  const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

  let target = current;

  if (e.key === "ArrowDown") {
    target = Math.min(Math.ceil((current + 1) / pageHeight) * pageHeight, maxScroll);
  }

  if (e.key === "ArrowUp") {
    target = Math.max(Math.floor((current - 1) / pageHeight) * pageHeight, 0);
  }

  scrollContainer.scrollTo({
    top: target,
    behavior: "smooth",
  });
});

// --------------------
// SCROLL UI
// --------------------
function onScroll() {
  if (!scrollContainer) return;

  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight;
  const clientHeight = scrollContainer.clientHeight;

  if (footer) {
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  }

  if (scrollHint) {
    if (scrollTop > 50) scrollHint.classList.remove("visible");
    else scrollHint.classList.add("visible");
  }
}

if (scrollContainer) {
  scrollContainer.addEventListener("scroll", onScroll);
}

if (scrollHint && isGalleryPage && !isMobileViewport()) {
  scrollHint.classList.add("visible");
}

// --------------------
// GALLERY
// --------------------
function getOffset(project, ratio) {
  if (isMobileViewport()) {
    return project.offsetMobile || { x: 0, y: 0 };
  }

  if (ratio > 1 && project.offsetLandscape) return project.offsetLandscape;
  if (ratio <= 1 && project.offsetPortrait) return project.offsetPortrait;
  return { x: 0, y: 0 };
}

function createCaption(project) {
  const caption = document.createElement("div");
  caption.classList.add("img-caption");
  caption.innerHTML = `
    <div class="img-caption-line1">
      ${project.name}${project.location ? `, ${project.location}` : ""}
    </div>
    <div class="img-caption-line2">
      ${project.author || ""}
    </div>
  `;
  return caption;
}

function createCard(project, baseCX = 0, baseCY = 0) {
  const card = document.createElement("div");
  card.classList.add("project-card");

  if (!isMobileViewport()) {
    card.style.position = "absolute";
    card.style.transform = "translate(-50%, -50%)";
    card.style.left = `${baseCX}px`;
    card.style.top = `${baseCY}px`;
  }

  const wrap = document.createElement("div");
  wrap.classList.add("project-img-wrap");

  if (!isMobileViewport() && project.maxWidth) wrap.style.maxWidth = project.maxWidth;
  if (!isMobileViewport() && project.maxHeight) wrap.style.maxHeight = project.maxHeight;

  const img = document.createElement("img");
  img.classList.add("project-img");
  img.alt = project.name;

  if (!isMobileViewport() && project.maxWidth) img.style.maxWidth = project.maxWidth;
  if (!isMobileViewport() && project.maxHeight) img.style.maxHeight = project.maxHeight;
  if (isMobileViewport() && project.heightMobile) img.style.height = project.heightMobile;

  img.addEventListener("load", () => {
    if (!isMobileViewport()) {
      const ratio = img.naturalWidth / img.naturalHeight;
      const offset = getOffset(project, ratio);
      card.style.left = `${baseCX + (offset.x || 0)}px`;
      card.style.top = `${baseCY + (offset.y || 0)}px`;
    }
  });

  img.src = project.cover;

  const caption = createCaption(project);
  wrap.appendChild(img);
  wrap.appendChild(caption);

  const dotsEl = document.createElement("div");
  dotsEl.classList.add("img-dots");

  let activeDotIndex = 0;

  function setActiveImage(idx) {
    activeDotIndex = idx;
    const src = project.images[idx];

    dotsEl.querySelectorAll(".img-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === idx);
    });

    const probe = new Image();
    probe.onload = () => {
      img.src = src;

      if (!isMobileViewport()) {
        const ratio = probe.naturalWidth / probe.naturalHeight;
        const offset = getOffset(project, ratio);
        card.style.left = `${baseCX + (offset.x || 0)}px`;
        card.style.top = `${baseCY + (offset.y || 0)}px`;
      }
    };
    probe.src = src;
  }

  (project.images || []).forEach((src, idx) => {
    const dot = document.createElement("button");
    dot.classList.add("img-dot");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show image ${idx + 1} for ${project.name}`);
    if (idx === 0) dot.classList.add("active");

    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveImage(idx);
    });

    dotsEl.appendChild(dot);
  });

  card.appendChild(wrap);
  card.appendChild(dotsEl);

  card.addEventListener("click", (e) => {
    if (e.target.closest(".img-dot")) return;
    openProject(project, activeDotIndex, setActiveImage);
  });

  return card;
}

function renderGallery(projects) {
  if (!scrollContainer) return;

  const gallery = document.getElementById("gallery") || scrollContainer;

  if (isMobileViewport()) {
    const section = document.createElement("div");
    section.classList.add("gallery-section", "mobile-columns");

    const leftCol = document.createElement("div");
    leftCol.classList.add("mobile-column");

    const rightCol = document.createElement("div");
    rightCol.classList.add("mobile-column");

    projects.forEach((project, index) => {
      const card = createCard(project);
      if (index % 2 === 0) leftCol.appendChild(card);
      else rightCol.appendChild(card);
    });

    section.appendChild(leftCol);
    section.appendChild(rightCol);
    gallery.appendChild(section);
  } else {
    for (let i = 0; i < projects.length; i += 2) {
      const pair = projects.slice(i, i + 2);
      const section = document.createElement("div");
      section.classList.add("gallery-section");

      pair.forEach((project, pairIdx) => {
        const baseCX = pairIdx === 0 ? window.innerWidth * 0.27 : window.innerWidth * 0.73;
        const baseCY = window.innerHeight * 0.5;
        const card = createCard(project, baseCX, baseCY);
        section.appendChild(card);
      });

      gallery.appendChild(section);
    }
  }
}

// --------------------
// MOBILE CONTACT TRANSITIONS
// --------------------
function setupMobileContactTransition() {
  if (!mobileInfoBtn || !pageTransitionCircle || !contactTransitionOverlay) return;

  mobileInfoBtn.addEventListener("click", () => {
    if (!isMobileViewport()) {
      window.location.href = "contact.html";
      return;
    }

    document.body.classList.add("viewer-open");
    contactTransitionOverlay.classList.add("active");
    pageTransitionCircle.classList.add("active");

    window.setTimeout(() => {
      contactTransitionOverlay.classList.add("reveal");
    }, 180);

    window.setTimeout(() => {
      window.location.href = "contact.html";
    }, 900);
  });
}

function setupMobileContactPageState() {
  if (!isContactPage) return;

  if (isMobileViewport()) {
    document.body.classList.add("mobile-contact-dark");
  } else {
    document.body.classList.remove("mobile-contact-dark");
  }
}

function setupMobileContactCloseTransition() {
  if (!contactCloseBtn || !pageTransitionCircleReverse || !contactTransitionOverlayReverse) return;

  contactCloseBtn.addEventListener("click", (e) => {
    if (!isMobileViewport()) return;

    e.preventDefault();

    document.body.classList.add("mobile-contact-dark", "contact-closing");
    contactTransitionOverlayReverse.classList.add("active", "closing");

    window.setTimeout(() => {
      pageTransitionCircleReverse.classList.add("shrink");
    }, 140);

    window.setTimeout(() => {
      window.location.href = contactCloseBtn.getAttribute("href") || "index.html";
    }, 820);
  });
}

// --------------------
// INIT
// --------------------
setupCursor();
setupContactLink();
setupViewerInteractions();
setupMobileContactTransition();
setupMobileContactPageState();
setupMobileContactCloseTransition();

window.addEventListener("resize", () => {
  if (isContactPage) {
    setupMobileContactPageState();
  }
});

if (isGalleryPage) {
  showLoader();

  fetch("gallery.json")
    .then((res) => res.json())
    .then((projects) => {
      renderGallery(projects);
      hideLoader();
      onScroll();
    })
    .catch((err) => {
      console.error("Could not load gallery.json:", err);
      hideLoader();
    });
}