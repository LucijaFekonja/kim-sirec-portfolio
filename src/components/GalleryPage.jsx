import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import projects from "../../gallery.json";
import { legalDocuments } from "../translations";
import LegalModal from "./LegalModal";
import ProjectCard from "./ProjectCard";
import Viewer from "./Viewer";

let galleryHasLoaded = false;
const MINIMUM_LOADER_DURATION = 500;

export default function GalleryPage({ onOpenInfo, language, legalDocument, onCloseLegal }) {
  // Keep the previously disabled Kim Širec header link inactive.
  const navigate = () => {};
  const scrollRef = useRef(null);
  const initialViewport = useRef({ width: window.innerWidth, height: window.innerHeight });
  const viewportRef = useRef(initialViewport.current);
  const resizeFrame = useRef();
  const [viewport, setViewport] = useState(initialViewport.current);
  const mobile = viewport.width <= 768;
  const [loaded, setLoaded] = useState(() => galleryHasLoaded ? projects.length : 0);
  const [minimumLoadProgress, setMinimumLoadProgress] = useState(() => galleryHasLoaded ? 100 : 0);
  const [hint, setHint] = useState(true);
  const [viewer, setViewer] = useState({ project: null, index: 0, onClose: null, transitionName: null });

  const openViewer = (
    project,
    index,
    onClose,
    transitionName,
    sourceImage
  ) => {
    history.pushState({ viewerOpen: true }, "");
  
    const showViewer = () => {
      flushSync(() => {
        setViewer({
          project,
          index,
          onClose,
          transitionName,
        });
      });
    };
  
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  
    if (
      !document.startViewTransition ||
      reducedMotion ||
      !sourceImage
    ) {
      showViewer();
      return;
    }
  
    // OLD state:
    // Give the gallery image its transition name.
    const previousTransition = sourceImage.style.transition;
    const previousOpacity = sourceImage.style.opacity;
    sourceImage.style.transition = "none";
    sourceImage.style.opacity = "1";
    sourceImage.style.viewTransitionName = transitionName;
  
    document.documentElement.classList.add("viewer-opening");
  
    const transition = document.startViewTransition(() => {
      /*
       * IMPORTANT:
       * The old snapshot has already been captured at this point.
       *
       * Remove the transition name from the gallery image so that
       * in the NEW state only the Viewer image owns this name.
       */
      sourceImage.style.viewTransitionName = "none";
      sourceImage.style.transition = previousTransition;
      sourceImage.style.opacity = previousOpacity;
    
      showViewer();
    });
  
    transition.finished.finally(() => {
      sourceImage.style.transition = previousTransition;
      sourceImage.style.opacity = previousOpacity;
      document.documentElement.classList.remove("viewer-opening");
    });
  };
  
  useEffect(() => {
    const updateViewport = () => {
      window.cancelAnimationFrame(resizeFrame.current);
      resizeFrame.current = window.requestAnimationFrame(() => {
        const next = { width: window.innerWidth, height: window.innerHeight };
        const crossedBreakpoint = (viewportRef.current.width <= 768) !== (next.width <= 768);
        viewportRef.current = next;

        // Flexbox and viewport units handle ordinary resizing without a React render.
        if (!crossedBreakpoint) return;

        if (document.startViewTransition) {
          document.documentElement.classList.add("gallery-reordering");
          const transition = document.startViewTransition(() => {
            flushSync(() => setViewport(next));
          });
          transition.finished.finally(() => document.documentElement.classList.remove("gallery-reordering"));
          return;
        }

        setViewport(next);
      });
    };

    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.cancelAnimationFrame(resizeFrame.current);
      document.documentElement.classList.remove("gallery-reordering");
    };
  }, []);

  useEffect(() => {
    if (galleryHasLoaded) return undefined;

    let cancelled = false;
    projects.forEach((project) => {
      const image = new Image();
      image.onload = image.onerror = () => { if (!cancelled) setLoaded((count) => count + 1); };
      image.src = `/${project.cover}`;
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (galleryHasLoaded) return undefined;

    const startedAt = performance.now();
    let animationFrame;
    const advanceMinimumDuration = (now) => {
      const progress = Math.min(100, ((now - startedAt) / MINIMUM_LOADER_DURATION) * 100);
      setMinimumLoadProgress(progress);
      if (progress < 100) animationFrame = window.requestAnimationFrame(advanceMinimumDuration);
    };

    animationFrame = window.requestAnimationFrame(advanceMinimumDuration);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (loaded >= projects.length) galleryHasLoaded = true;
  }, [loaded]);

  useEffect(() => {
    const key = (event) => {
      if (document.body.classList.contains("legal-open")) return;
      if (viewer.project) return;
      const target = mobile ? window : scrollRef.current;
      const step = Math.round(window.innerHeight);
      if (["ArrowDown", "PageDown"].includes(event.key)) { event.preventDefault(); target.scrollBy({ top: step, behavior: "smooth" }); }
      if (["ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); target.scrollBy({ top: -step, behavior: "smooth" }); }
      if (event.key === "Home") { event.preventDefault(); target.scrollTo({ top: 0, behavior: "smooth" }); }
      if (event.key === "End") { event.preventDefault(); target.scrollTo({ top: mobile ? document.body.scrollHeight : target.scrollHeight, behavior: "smooth" }); }
    };
    document.addEventListener("keydown", key); return () => document.removeEventListener("keydown", key);
  }, [viewer.project, mobile]);

  const imageLoadProgress = (loaded / projects.length) * 100;
  const loadingProgress = Math.round(Math.min(imageLoadProgress, minimumLoadProgress));
  const ready = loaded >= projects.length && minimumLoadProgress >= 100;
  const columns = [projects.filter((_, index) => index % 2 === 0), projects.filter((_, index) => index % 2 === 1)];

  return <>
    <div className={`scroll-hint${hint ? " visible" : ""}`} aria-hidden="true"><img src="/icons/arrow-down_128.png" alt="" width="20" height="20" /></div>
    <div id="loader" className={ready ? "loaded" : "active"} aria-live="polite">
      <div className="loader-inner">
        <div className="pour-loader" style={{ "--fill-level": `${loadingProgress}%`, "--squiggle-width": `${58 + loadingProgress * 0.1}%` }} aria-hidden="true">
          <svg className="tetra-pak" viewBox="0 0 92 122" role="presentation">
            <path className="tetra-face" d="M10 34 L66 34 L66 112 L10 112 Z" />
            <path className="tetra-side" d="M66 34 L82 41 L82 105 L66 112 Z" />
            <path className="tetra-roof" d="M10 34 L27 12 L61 12 L66 34 Z" />
            <path className="tetra-roof-side" d="M61 12 L78 22 L82 41 L66 34 Z" />
            <path className="tetra-seam" d="M27 12 L29 5 L62 5 L61 12" />
            <path className="tetra-opening" d="M72 25 C76 22 82 24 83 28 C84 32 80 35 76 34 C72 33 70 29 72 25 Z" />
            {/* <path className="tetra-detail" d="M22 51 L54 51 M22 91 L54 91" /> */}
            {/* <text x="38" y="74" textAnchor="middle">MILK</text> */}
          </svg>
          <div className="loading-glass">
            <svg className="glass-outline" viewBox="0 0 75 100" role="presentation">
              <ellipse cx="37.5" cy="7" rx="35" ry="6" />
              <path d="M2.5 7 L11 92" />
              <path d="M72.5 7 L64 92" />
              <ellipse cx="37.5" cy="92" rx="26.5" ry="5" />
            </svg>
            <div className="glass-fill-mask">
              <div className="glass-milk">
                <svg className="milk-squiggle" viewBox="0 0 72 10" preserveAspectRatio="none" role="presentation">
                  <path d="M1 5 C7 2 13 2 19 5 S31 8 37 5 S49 2 55 5 S67 8 71 5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* <span className="loader-name">Kim Širec Photography</span> */}
        {/* <span className="loader-percentage">{loadingProgress}%</span>  */}
      </div>
    </div>
    <main className="gallery-container" id="scrollContainer" ref={scrollRef} onScroll={(event) => setHint(event.currentTarget.scrollTop < 50)}>
      <button className="mobile-contact-btn" type="button" aria-label="Open info page" onClick={onOpenInfo}><span className="mobile-info-text">info</span><span className="mobile-info-dot" /></button>
      <header className="header"><div className="header-clip"><div className="header-inner" role="link" tabIndex="0" onClick={() => navigate("/contact")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); navigate("/contact"); } }}><span className="header-name">Kim Širec Photography</span><span className="header-contact">info</span></div></div></header>
      <div className={`gallery gallery-layout ${mobile ? "mobile-layout" : "desktop-layout"}`}>
        <div className="gallery-columns">
          {columns.map((column, columnIndex) => <div className="gallery-column" key={columnIndex}>{column.map((project) => { const projectIndex = projects.indexOf(project); const transitionName = `project-${projectIndex}`; return <ProjectCard key={project.cover} project={project} projectIndex={projectIndex} language={language} isMobile={mobile} onOpen={openViewer} transitionName={transitionName} activeClosingTransition={viewer.closing ? viewer.transitionName : null} revealEnabled={ready} />; })}</div>)}
        </div>
        <Footer language={language} />
      </div>
    </main>
    <Viewer state={viewer} setState={setViewer} />
    {legalDocument && <LegalModal type={legalDocument} language={language} onClose={onCloseLegal} />}
  </>;
}

function Footer({ language }) {
  return <div className="footer legal-footer"><Link to="/privacy-policy">{legalDocuments[language].privacy.linkLabel}</Link><Link to="/terms-and-conditions">{legalDocuments[language].terms.linkLabel}</Link><a className="developer-signature" href="https://github.com/LucijaFekonja" target="_blank" rel="noreferrer">Site by Lucija Fekonja</a></div>;
}
