const scrollContainer = document.getElementById("scrollContainer");
const viewer          = document.getElementById("viewer");
const titleContainer  = document.getElementById("viewer-title-container");
const cursor          = document.getElementById("cursor");
const footer          = document.querySelector(".footer");
const scrollHint      = document.getElementById("scrollHint");

// --------------------
// CUSTOM CURSOR
// --------------------
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});

function isCursorTarget(el) {
  return el.closest(".project-card, .viewer-arrow, a, button, .header-inner, .img-dot");
}
document.addEventListener("mouseover", (e) => { if (isCursorTarget(e.target)) cursor.classList.add("hovering"); });
document.addEventListener("mouseout",  (e) => { if (isCursorTarget(e.target)) cursor.classList.remove("hovering"); });

// --------------------
// OPEN PROJECT VIEWER
// --------------------
let currentIndex  = 0;
let currentImages = [];
let viewerTrack;

function openProject(project, startIndex = 0) {
  viewer.innerHTML = "";
  viewer.classList.add("active");
  currentImages = project.images;
  currentIndex  = startIndex;

  viewerTrack = document.createElement("div");
  viewerTrack.classList.add("viewer-track");

  currentImages.forEach((src) => {
    const slide = document.createElement("div");
    slide.classList.add("viewer-slide");
    const img = document.createElement("img");
    img.src = src;
    slide.appendChild(img);
    viewerTrack.appendChild(slide);
  });

  viewer.appendChild(viewerTrack);
  titleContainer.textContent = project.name;
  titleContainer.classList.add("active");

  const leftArrow = document.createElement("div");
  leftArrow.classList.add("viewer-arrow", "left");
  leftArrow.innerHTML = "&#8249;";
  leftArrow.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); });

  const rightArrow = document.createElement("div");
  rightArrow.classList.add("viewer-arrow", "right");
  rightArrow.innerHTML = "&#8250;";
  rightArrow.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); });

  viewer.appendChild(leftArrow);
  viewer.appendChild(rightArrow);
  updateViewerSlide();
}

function updateViewerSlide() {
  if (!viewerTrack) return;
  viewerTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
  const l = viewer.querySelector(".viewer-arrow.left");
  const r = viewer.querySelector(".viewer-arrow.right");
  if (l) l.style.opacity = currentIndex === 0 ? "0" : "1";
  if (r) r.style.opacity = currentIndex === currentImages.length - 1 ? "0" : "1";
}

function nextSlide() { if (currentIndex < currentImages.length - 1) { currentIndex++; updateViewerSlide(); } }
function prevSlide() { if (currentIndex > 0) { currentIndex--; updateViewerSlide(); } }

// --------------------
// CLOSE VIEWER
// --------------------
function closeViewer() {
  viewer.classList.remove("active");
  viewer.innerHTML = "";
  titleContainer.textContent = "";
  titleContainer.classList.remove("active");
}

viewer.addEventListener("click", (e) => {
  if (!e.target.closest(".viewer-slide img") && !e.target.closest(".viewer-arrow")) closeViewer();
});

// --------------------
// KEYBOARD NAVIGATION
// --------------------
document.addEventListener("keydown", (e) => {
  if (!viewer.classList.contains("active")) return;
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft")  prevSlide();
  if (e.key === "Escape")     closeViewer();
});

// --------------------
// TRACKPAD SWIPE IN VIEWER
// --------------------
viewer.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

viewer.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
}, { passive: true });

viewer.addEventListener("wheel", (e) => {
  if (!viewer.classList.contains("active")) return;
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    e.preventDefault();
    if (e.deltaX > 30) nextSlide();
    else if (e.deltaX < -30) prevSlide();
  }
}, { passive: false });

// --------------------
// SMOOTH SCROLL SNAP (desktop only)
// --------------------
let isScrolling = false;

if (window.innerWidth > 768) {
  scrollContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;
    const dir  = e.deltaY > 0 ? 1 : -1;
    const h    = scrollContainer.clientHeight;
    const snap = Math.round(scrollContainer.scrollTop / h);
    scrollContainer.scrollTo({ top: (snap + dir) * h, behavior: "smooth" });
    setTimeout(() => { isScrolling = false; }, 800);
  }, { passive: false });
}

// --------------------
// KEYBOARD GALLERY SCROLL
// --------------------
document.addEventListener("keydown", (e) => {
  if (viewer.classList.contains("active")) return;
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  e.preventDefault();
  if (isScrolling) return;
  isScrolling = true;
  const h    = scrollContainer.clientHeight;
  const snap = Math.round(scrollContainer.scrollTop / h);
  const dir  = e.key === "ArrowDown" ? 1 : -1;
  scrollContainer.scrollTo({ top: (snap + dir) * h, behavior: "smooth" });
  setTimeout(() => { isScrolling = false; }, 800);
});

// --------------------
// SHOW FOOTER ON LAST ROW
// --------------------
// --------------------
// SCROLL POSITION TRACKING
// --------------------
// On mobile, body scrolls. On desktop, #scrollContainer scrolls.
function onScroll() {
  const scrollTop = isMobile ? window.scrollY : scrollContainer.scrollTop;
  const atTop     = scrollTop < 50;
  scrollHint.classList.toggle("visible", atTop);
}

scrollContainer.addEventListener("scroll", onScroll);
window.addEventListener("scroll", onScroll);

// --------------------
// SCROLL HINT ARROW
// --------------------
scrollHint.classList.add("visible");

// --------------------
// CONTACT PAGE
// --------------------
document.querySelector(".header-contact").addEventListener("click", () => {
  window.location.href = "contact.html";
});

// --------------------
// OFFSET HELPER
// --------------------
// Desktop: offsetPortrait (photo taller than wide) or offsetLandscape (wider than tall)
// Mobile:  offsetMobile (single offset, ignores aspect ratio)
const isMobile = window.innerWidth <= 768;

function pickOffset(naturalW, naturalH, project) {
  if (isMobile) return project.offsetMobile || { x: 0, y: 0 };
  const isPortraitPhoto = naturalH > naturalW;
  return isPortraitPhoto
    ? (project.offsetPortrait  || project.offsetLandscape || { x: 0, y: 0 })
    : (project.offsetLandscape || { x: 0, y: 0 });
}

// --------------------
// LOADER
// --------------------
const loader = document.getElementById("loader");
 
function showLoader() { loader.classList.add("active"); }
function hideLoader() { loader.classList.remove("active"); }
 
function preloadImages(urls) {
  const bar = document.getElementById("loaderBar");
  let loaded = 0;
  const total = urls.length;
  return Promise.all(urls.map(src => new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if (bar) bar.style.width = `${Math.round((loaded / total) * 100)}%`;
      resolve();
    };
    img.src = src;
  })));
}

// --------------------
// LOAD PROJECT DATA
// --------------------
showLoader();

fetch("gallery.json")
  .then((r) => r.json())
  .then((projects) => {
    // Preload all cover images before building the gallery
    const covers = projects.map(p => p.cover);
    return preloadImages(covers).then(() => projects);
  })
  .then((projects) => {
    // Group into pairs — each pair = one scroll-snap section
    for (let i = 0; i < projects.length; i += 2) {
      const pair    = projects.slice(i, i + 2);
      const section = document.createElement("div");
      section.classList.add("gallery-section");
      if (isMobile) {
        // Use the first project's heightMobile if defined, fallback to 55vh
        const h = pair[0].heightMobile || pair[1]?.heightMobile || "55vh";
        section.style.height = h;
      }

      pair.forEach((project, pairIdx) => {
        const baseCX = isMobile
          ? (pairIdx === 0 ? window.innerWidth * 0.25 : window.innerWidth * 0.75)
          : (pairIdx === 0 ? window.innerWidth * 0.27 : window.innerWidth * 0.73);
        const baseCY = window.innerHeight * 0.5;

        const card = document.createElement("div");
        card.classList.add("project-card");
        card.style.position  = "absolute";
        card.style.transform = "translate(-50%, -50%)";
        card.style.left      = `${baseCX}px`;
        card.style.top       = `${baseCY}px`;

        // Image wrapper
        const wrap = document.createElement("div");
        wrap.classList.add("project-img-wrap");
        if (!isMobile && project.maxWidth)  wrap.style.maxWidth  = project.maxWidth;
        if (!isMobile && project.maxHeight) wrap.style.maxHeight = project.maxHeight;

        const img = document.createElement("img");
        img.classList.add("project-img");
        img.alt = project.name;
        if (!isMobile && project.maxWidth)  img.style.maxWidth  = project.maxWidth;
        if (!isMobile && project.maxHeight) img.style.maxHeight = project.maxHeight;

        // Position card once cover loads — use photo's own aspect ratio
        img.addEventListener("load", () => {
          const off = pickOffset(img.naturalWidth, img.naturalHeight, project);
          card.style.left = `${baseCX + off.x}px`;
          card.style.top  = `${baseCY + off.y}px`;
        });
        img.src = project.cover; // set AFTER attaching load listener

        // Caption
        const caption = document.createElement("span");
        caption.classList.add("img-caption");
        caption.textContent = project.name;

        wrap.appendChild(img);
        wrap.appendChild(caption);

        // Dots
        const dotsEl = document.createElement("div");
        dotsEl.classList.add("img-dots");

        let activeDotIndex = 0;

        project.images.forEach((src, idx) => {
          const dot = document.createElement("div");
          dot.classList.add("img-dot");
          if (idx === 0) dot.classList.add("active");

          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            activeDotIndex = idx;
            dotsEl.querySelectorAll(".img-dot").forEach((d, di) => {
              d.classList.toggle("active", di === idx);
            });
            // Probe new image's dimensions before swapping so card repositions correctly
            const probe = new Image();
            probe.onload = () => {
              img.src = src;
              const off = pickOffset(probe.naturalWidth, probe.naturalHeight, project);
              card.style.left = `${baseCX + off.x}px`;
              card.style.top  = `${baseCY + off.y}px`;
            };
            probe.src = src;
          });

          dotsEl.appendChild(dot);
        });

        card.appendChild(wrap);
        card.appendChild(dotsEl);

        card.addEventListener("click", (e) => {
          if (e.target.closest(".img-dot")) return;
          openProject(project, activeDotIndex);
        });

        section.appendChild(card);
      });

      scrollContainer.appendChild(section);
    }

    // Place footer inside the last section so it's absolutely positioned
    // at the bottom of the last row — visible only when scrolled there
    const lastSection = scrollContainer.querySelector(".gallery-section:last-child");
    if (lastSection) lastSection.appendChild(footer);

    hideLoader();
  })
  .catch((err) => console.error("Could not load gallery.json:", err));