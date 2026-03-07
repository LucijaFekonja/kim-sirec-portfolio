const gallery = document.getElementById("gallery");
const viewer = document.getElementById("viewer");

const cursor = document.getElementById("cursor");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

// --------------------
// LOAD PROJECT DATA
// --------------------
fetch("gallery.json")
.then(res => res.json())
.then(projects => {

    projects.forEach(project => {

        const wrapper = document.createElement("div");
        wrapper.classList.add("gallery-item");

        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img-wrapper");

        const img = document.createElement("img");
        img.src = project.cover;
        img.loading = "lazy";

        imgWrapper.dataset.title = project.name;

        imgWrapper.appendChild(img);
        wrapper.appendChild(imgWrapper);

        imgWrapper.addEventListener("click", () => {
            openProject(project);
        });

        gallery.appendChild(wrapper);
    });

});


// --------------------
// CUSTOM CURSOR + FLOATING LABEL
// --------------------
const label = document.createElement("div");
label.classList.add("cursor-label");
document.body.appendChild(label);

document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    label.style.left = (e.clientX + 16) + "px";
    label.style.top = (e.clientY - 8) + "px";
});


// --------------------
// CURSOR HOVER STATES
// --------------------
document.addEventListener("mouseover", e => {
    const imgWrapper = e.target.closest(".img-wrapper");
    const arrow = e.target.closest(".viewer-arrow");
    const footerLink = e.target.closest("a, button, .header-inner");

    if (imgWrapper) {
        cursor.classList.add("hovering");
        const parts = imgWrapper.dataset.title.split(": ");
        label.innerHTML = parts[0] + ":<br>" + (parts[1] || "");
        label.classList.add("visible");
    } else if (arrow || footerLink) {
        cursor.classList.add("hovering");
    }
});

document.addEventListener("mouseout", e => {
    const imgWrapper = e.target.closest(".img-wrapper");
    const arrow = e.target.closest(".viewer-arrow");
    const footerLink = e.target.closest("a, button, .header-inner");

    if (imgWrapper) {
        label.classList.remove("visible");
    }
    if (imgWrapper || arrow || footerLink) {
        cursor.classList.remove("hovering");
    }
});


// --------------------
// OPEN PROJECT VIEWER
// --------------------
let currentIndex = 0;
let currentImages = [];
let track;

function openProject(project) {
    viewer.innerHTML = "";
    viewer.classList.add("active");

    currentImages = project.images;
    currentIndex = 0;

    track = document.createElement("div");
    track.classList.add("viewer-track");

    currentImages.forEach(src => {
        const slide = document.createElement("div");
        slide.classList.add("viewer-slide");

        const img = document.createElement("img");
        img.src = src;

        slide.appendChild(img);
        track.appendChild(slide);
    });

    viewer.appendChild(track);

    const leftArrow = document.createElement("div");
    leftArrow.classList.add("viewer-arrow", "left");
    leftArrow.innerHTML = "‹";
    leftArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        prevSlide();
    });

    const rightArrow = document.createElement("div");
    rightArrow.classList.add("viewer-arrow", "right");
    rightArrow.innerHTML = "›";
    rightArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        nextSlide();
    });

    viewer.appendChild(leftArrow);
    viewer.appendChild(rightArrow);

    updateSlide();
}

function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}vw)`;
}

function nextSlide() {
    if (currentIndex < currentImages.length - 1) {
        currentIndex++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
    }
}


// --------------------------
// KEYBOARD NAVIGATION
// --------------------------
document.addEventListener("keydown", e => {
    if (!viewer.classList.contains("active")) return;

    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "Escape") closeViewer();
});


// --------------------
// CLOSE VIEWER
// --------------------
function closeViewer() {
    viewer.classList.remove("active");
    viewer.innerHTML = "";
}

viewer.addEventListener("click", (e) => {
    if (!e.target.closest(".viewer-slide img") &&
        !e.target.closest(".viewer-arrow")) {
        closeViewer();
    }
});


// --------------------
// SMOOTH SCROLL SNAP (desktop only)
// --------------------
const scrollContainer = document.getElementById("scrollContainer");
let isScrolling = false;

if (window.innerWidth > 768) {
    scrollContainer.addEventListener("wheel", (e) => {
        e.preventDefault();

        if (isScrolling) return;
        isScrolling = true;

        const direction = e.deltaY > 0 ? 1 : -1;
        const itemHeight = scrollContainer.clientHeight;
        const currentSnap = Math.round(scrollContainer.scrollTop / itemHeight);
        const targetScrollTop = (currentSnap + direction) * itemHeight;

        scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
        });

        setTimeout(() => {
            isScrolling = false;
        }, 800);

    }, { passive: false });
}


// --------------------
// CONTACT PAGE
// --------------------
const contactPage = document.getElementById("contactPage");
const contactClose = document.getElementById("contactClose");
const headerContact = document.querySelector(".header-contact");

headerContact.addEventListener("click", () => {
    contactPage.classList.add("active");
});

contactClose.addEventListener("click", () => {
    contactPage.classList.remove("active");
});

// --------------------
// SHOW FOOTER ON LAST ROW
// --------------------
const footer = document.querySelector(".footer");

scrollContainer.addEventListener("scroll", () => {
    const scrollBottom = scrollContainer.scrollTop + scrollContainer.clientHeight;
    const totalHeight = scrollContainer.scrollHeight;

    if (scrollBottom >= totalHeight - scrollContainer.clientHeight) {
        footer.classList.add("visible");
    } else {
        footer.classList.remove("visible");
    }
});