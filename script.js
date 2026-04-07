const scrollContainer = document.getElementById("scrollContainer");
const viewer = document.getElementById("viewer");
const titleContainer = document.getElementById("viewer-title-container");
const cursor = document.getElementById("cursor");
const footer = document.querySelector(".footer");
const scrollHint = document.getElementById("scrollHint");
const headerInner = document.querySelector(".header-inner");
const loader = document.getElementById("loader");

const mobileInfoBtn = document.getElementById("mobileInfoBtn");
const pageTransitionCircle = document.getElementById("pageTransitionCircle");
const contactTransitionOverlay = document.getElementById(
  "contactTransitionOverlay",
);
const contactTransitionX = document.getElementById("contactTransitionX");

const isMobile = window.innerWidth <= 768;

const isGalleryPage = Boolean(scrollContainer && viewer && titleContainer);

let viewerTrack = null;
let currentImages = [];
let currentIndex = 0;

let currentCardSync = null;

let touchStartX = 0;
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
  if (loader) loader.classList.remove("active");
}

function setupCursor() {
  if (!cursor) return;

  document.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const isCursorTarget = (element) =>
    Boolean(
      element?.closest(
        ".project-card, .viewer-arrow, a, button, .header-inner, .img-dot",
      ),
    );

  document.addEventListener("mouseover", (event) => {
    if (isCursorTarget(event.target)) cursor.classList.add("hovering");
  });

  document.addEventListener("mouseout", (event) => {
    if (isCursorTarget(event.target)) cursor.classList.remove("hovering");
  });
}

function setupContactLink() {
  if (!headerInner) return;

  const goToContact = () => {
    window.location.href = "contact.html";
  };

  headerInner.addEventListener("click", goToContact);
  headerInner.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToContact();
    }
  });
}

function setupMobileContactTransition() {
  if (!mobileInfoBtn || !pageTransitionCircle || !contactTransitionOverlay)
    return;

  let isContactOpen = false;

  function openMobileContact() {
    if (window.innerWidth > 768) {
      window.location.href = "contact.html";
      return;
    }

    if (isContactOpen) return;
    isContactOpen = true;

    document.body.classList.add("viewer-open");
    contactTransitionOverlay.setAttribute("aria-hidden", "false");
    contactTransitionOverlay.classList.add("active");
    pageTransitionCircle.classList.add("active");

    window.setTimeout(() => {
      contactTransitionOverlay.classList.add("reveal");
    }, 180);
  }

  function closeMobileContact() {
    if (window.innerWidth > 768 || !isContactOpen) return;

    isContactOpen = false;

    contactTransitionOverlay.classList.remove("reveal");
    contactTransitionOverlay.classList.remove("active");
    contactTransitionOverlay.setAttribute("aria-hidden", "true");
    pageTransitionCircle.classList.remove("active");
    document.body.classList.remove("viewer-open");
  }

  mobileInfoBtn.addEventListener("click", openMobileContact);

  if (contactTransitionX) {
    contactTransitionX.addEventListener("click", closeMobileContact);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileContact();
    }
  });
}

function updateViewerSlide() {
  if (!viewerTrack) return;

  const slides = viewerTrack.querySelectorAll(".viewer-slide");

  slides.forEach((slide, index) => {
    if (index === currentIndex) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });
  const leftArrow = viewer.querySelector(".viewer-arrow.left");
  const rightArrow = viewer.querySelector(".viewer-arrow.right");

  if (leftArrow) {
    leftArrow.style.opacity = currentIndex === 0 ? "0" : "1";
    leftArrow.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
  }

  if (rightArrow) {
    rightArrow.style.opacity =
      currentIndex === currentImages.length - 1 ? "0" : "1";
    rightArrow.style.pointerEvents =
      currentIndex === currentImages.length - 1 ? "none" : "auto";
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

  viewer.innerHTML = "";
  viewer.classList.add("active");
  history.pushState({ viewerOpen: true }, "");

  currentImages = project.images || [];
  currentIndex = startIndex;
  currentCardSync = onClose;

  viewerTrack = document.createElement("div");
  viewerTrack.classList.add("viewer-track");

  document.body.classList.add("viewer-open");

  currentImages.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.classList.add("viewer-slide");

    if (index === currentIndex) {
      slide.classList.add("active");
    }

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${project.name} image ${index + 1}`;

    slide.appendChild(img);
    viewerTrack.appendChild(slide);
  });

  viewer.appendChild(viewerTrack);

  const leftArrow = document.createElement("button");
  leftArrow.classList.add("viewer-arrow", "left");
  leftArrow.type = "button";
  leftArrow.setAttribute("aria-label", "Previous image");
  leftArrow.innerHTML = "&#8249;";
  leftArrow.addEventListener("click", (event) => {
    event.stopPropagation();
    prevSlide();
  });

  const rightArrow = document.createElement("button");
  rightArrow.classList.add("viewer-arrow", "right");
  rightArrow.type = "button";
  rightArrow.setAttribute("aria-label", "Next image");
  rightArrow.innerHTML = "&#8250;";
  rightArrow.addEventListener("click", (event) => {
    console.log(currentIndex);
    event.stopPropagation();
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

function closeViewer() {
  if (history.state?.viewerOpen) {
    history.back();
    return;
  }

  forceCloseViewer();
}

function forceCloseViewer() {
  if (!viewer || !titleContainer) return;

  if (currentCardSync) {
    currentCardSync(currentIndex);
    currentCardSync = null;
  }
  document.body.classList.remove("viewer-open");

  viewer.classList.remove("active");
  viewer.innerHTML = "";
  titleContainer.textContent = "";
  titleContainer.classList.remove("active");

  viewerTrack = null;
  currentImages = [];
  currentIndex = 0;
}

function pickOffset(naturalWidth, naturalHeight, project) {
  if (isMobile) return project.offsetMobile || { x: 0, y: 0 };

  const isPortraitPhoto = naturalHeight > naturalWidth;
  return isPortraitPhoto
    ? project.offsetPortrait || project.offsetLandscape || { x: 0, y: 0 }
    : project.offsetLandscape || { x: 0, y: 0 };
}

function preloadImages(urls) {
  const bar = document.getElementById("loaderBar");
  let loaded = 0;
  const total = Math.max(urls.length, 1);

  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            loaded += 1;
            if (bar) {
              bar.style.width = `${Math.round((loaded / total) * 100)}%`;
            }
            resolve();
          };
          img.src = src;
        }),
    ),
  );
}

function setupGalleryEvents() {
  if (!viewer) return;

  window.addEventListener("popstate", () => {
    if (viewer.classList.contains("active")) forceCloseViewer();
  });

  viewer.addEventListener("click", (event) => {
    if (
      !event.target.closest(".viewer-slide img") &&
      !event.target.closest(".viewer-arrow")
    ) {
      closeViewer();
    }
  });

  document.addEventListener("keydown", (event) => {
    const tagName = document.activeElement?.tagName;
    const isTypingTarget =
      document.activeElement?.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT";

    if (isTypingTarget) return;

    if (viewer.classList.contains("active")) {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "Escape") closeViewer();
      return;
    }

    if (!isGalleryPage) return;

    const scrollStep = Math.round(window.innerHeight);

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      if (isMobile) {
        window.scrollBy({ top: scrollStep, behavior: "smooth" });
      } else if (scrollContainer) {
        scrollContainer.scrollBy({ top: scrollStep, behavior: "smooth" });
      }
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      if (isMobile) {
        window.scrollBy({ top: -scrollStep, behavior: "smooth" });
      } else if (scrollContainer) {
        scrollContainer.scrollBy({ top: -scrollStep, behavior: "smooth" });
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (event.key === "End") {
      event.preventDefault();
      if (isMobile) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  });

  viewer.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
    },
    { passive: true },
  );

  if (viewer && isMobile) {
    viewer.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true },
    );

    viewer.addEventListener(
      "touchend",
      (e) => {
        if (!viewer.classList.contains("active")) return;

        const touch = e.changedTouches[0];
        const diffX = touchStartX - touch.clientX;
        const diffY = touchStartY - touch.clientY;

        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);

        const threshold = 40;

        // 👉 swipe UP only → close viewer
        if (diffY > threshold && absY > absX) {
          closeViewer();
          return;
        }

        // 👉 horizontal swipe → navigate
        if (absX > absY && absX > threshold) {
          if (diffX > 0) nextSlide();
          else prevSlide();
        }
      },
      { passive: true },
    );
  }

  viewer.addEventListener(
    "touchend",
    (event) => {
      const diff = touchStartX - event.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
      }
    },
    { passive: true },
  );

  viewer.addEventListener(
    "wheel",
    (event) => {
      if (!viewer.classList.contains("active")) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        if (event.deltaX > 30) nextSlide();
        else if (event.deltaX < -30) prevSlide();
      }
    },
    { passive: false },
  );

  const onScroll = () => {
    if (!scrollHint) return;
    const scrollTop = isMobile ? window.scrollY : scrollContainer.scrollTop;
    scrollHint.classList.toggle("visible", scrollTop < 50);
  };

  if (scrollContainer) scrollContainer.addEventListener("scroll", onScroll);
  window.addEventListener("scroll", onScroll);
  onScroll();
}

function createCard(project, baseCenterX, baseCenterY) {
  const card = document.createElement("div");
  card.classList.add("project-card");

  if (!isMobile) {
    card.style.position = "absolute";
    card.style.transform = "translate(-50%, -50%)";
    card.style.left = `${baseCenterX}px`;
    card.style.top = `${baseCenterY}px`;
  }

  const wrap = document.createElement("div");
  wrap.classList.add("project-img-wrap");

  if (!isMobile && project.maxWidth) wrap.style.maxWidth = project.maxWidth;
  if (!isMobile && project.maxHeight) wrap.style.maxHeight = project.maxHeight;

  const img = document.createElement("img");
  img.classList.add("project-img");
  img.alt = project.name;

  if (!isMobile && project.maxWidth) img.style.maxWidth = project.maxWidth;
  if (!isMobile && project.maxHeight) img.style.maxHeight = project.maxHeight;

  img.addEventListener("load", () => {
    if (!isMobile) {
      const offset = pickOffset(img.naturalWidth, img.naturalHeight, project);
      card.style.left = `${baseCenterX + offset.x}px`;
      card.style.top = `${baseCenterY + offset.y}px`;
    }
  });

  img.src = project.cover;

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

  wrap.appendChild(img);
  wrap.appendChild(caption);

  const dotsEl = document.createElement("div");
  dotsEl.classList.add("img-dots");

  let activeDotIndex = 0;

  function setActiveImage(index) {
    activeDotIndex = index;
    const src = project.images[index];

    dotsEl.querySelectorAll(".img-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });

    const probe = new Image();
    probe.onload = () => {
      img.src = src;
      if (!isMobile) {
        const offset = pickOffset(
          probe.naturalWidth,
          probe.naturalHeight,
          project,
        );
        card.style.left = `${baseCenterX + offset.x}px`;
        card.style.top = `${baseCenterY + offset.y}px`;
      }
    };
    probe.src = src;
  }

  project.images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("img-dot");
    dot.type = "button";
    dot.setAttribute(
      "aria-label",
      `Show image ${index + 1} of ${project.images.length}`,
    );

    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", (event) => {
      event.stopPropagation();
      setActiveImage(index);
    });

    dotsEl.appendChild(dot);
  });

  card.appendChild(wrap);
  card.appendChild(dotsEl);

  card.addEventListener("click", (event) => {
    if (event.target.closest(".img-dot")) return;
    openProject(project, activeDotIndex, setActiveImage);
  });

  return card;
}

function renderMobileLayout(projects) {
  const section = document.createElement("div");
  section.classList.add("gallery-section", "mobile-columns");

  const leftColumn = document.createElement("div");
  leftColumn.classList.add("mobile-column");

  const rightColumn = document.createElement("div");
  rightColumn.classList.add("mobile-column");

  projects.forEach((project, index) => {
    const card = createCard(project);
    (index % 2 === 0 ? leftColumn : rightColumn).appendChild(card);
  });

  section.appendChild(leftColumn);
  section.appendChild(rightColumn);
  scrollContainer.appendChild(section);
}

function renderDesktopLayout(projects) {
  for (let index = 0; index < projects.length; index += 2) {
    const pair = projects.slice(index, index + 2);

    const section = document.createElement("div");
    section.classList.add("gallery-section");

    pair.forEach((project, pairIndex) => {
      const baseCenterX =
        pairIndex === 0 ? window.innerWidth * 0.27 : window.innerWidth * 0.73;
      const baseCenterY = window.innerHeight * 0.5;
      const card = createCard(project, baseCenterX, baseCenterY);
      section.appendChild(card);
    });

    scrollContainer.appendChild(section);
  }
}

function initGalleryPage() {
  if (!isGalleryPage) return;

  setupGalleryEvents();

  showLoader();
  setupMobileContactTransition();

  fetch("gallery.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load gallery data.");
      return response.json();
    })
    .then((projects) =>
      preloadImages(projects.map((project) => project.cover)).then(
        () => projects,
      ),
    )
    .then((projects) => {
      if (isMobile) renderMobileLayout(projects);
      else renderDesktopLayout(projects);

      const lastSection = scrollContainer.querySelector(
        ".gallery-section:last-child",
      );
      if (footer) {
        if (isMobile) scrollContainer.appendChild(footer);
        else if (lastSection) lastSection.appendChild(footer);
      }

      hideLoader();
    })
    .catch((error) => {
      console.error("Could not load gallery data:", error);
      hideLoader();
    });
}

setupCursor();
setupContactLink();
initGalleryPage();
