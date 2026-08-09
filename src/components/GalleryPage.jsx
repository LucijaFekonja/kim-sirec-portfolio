import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import projects from "../../gallery.json";
import { legalDocuments } from "../translations";
import LegalModal from "./LegalModal";
import ProjectCard from "./ProjectCard";
import Viewer from "./Viewer";

let galleryHasLoaded = false;

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
  const [hint, setHint] = useState(true);
  const [viewer, setViewer] = useState({ project: null, index: 0, onClose: null });

  const openViewer = (project, index, onClose) => { history.pushState({ viewerOpen: true }, ""); setViewer({ project, index, onClose }); };

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

  const ready = loaded >= projects.length;
  const columns = [projects.filter((_, index) => index % 2 === 0), projects.filter((_, index) => index % 2 === 1)];

  return <>
    <button className="mobile-contact-btn" type="button" aria-label="Open info page" onClick={onOpenInfo}><span className="mobile-info-text">info</span><span className="mobile-info-dot" /></button>
    <div className={`scroll-hint${hint ? " visible" : ""}`} aria-hidden="true"><img src="/icons/arrow-down_128.png" alt="" width="20" height="20" /></div>
    <div id="loader" className={ready ? "" : "active"} aria-live="polite"><div className="loader-inner"><span className="loader-name">Kim Širec</span><div className="loader-bar-wrap"><div className="loader-bar" style={{ width: `${Math.round((loaded / projects.length) * 100)}%` }} /></div></div></div>
    <header className="header"><div className="header-clip"><div className="header-inner" role="link" tabIndex="0" onClick={() => navigate("/contact")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); navigate("/contact"); } }}><span className="header-name">Kim Širec</span><span className="header-contact">info</span></div></div></header>
    <main className="gallery-container" id="scrollContainer" ref={scrollRef} onScroll={(event) => setHint(event.currentTarget.scrollTop < 50)}>
      <div className={`gallery gallery-layout ${mobile ? "mobile-layout" : "desktop-layout"}`}>
        <div className="gallery-columns">
          {columns.map((column, columnIndex) => <div className="gallery-column" key={columnIndex}>{column.map((project) => { const projectIndex = projects.indexOf(project); return <ProjectCard key={project.cover} project={project} projectIndex={projectIndex} language={language} isMobile={mobile} onOpen={openViewer} transitionName={`project-${projectIndex}`} revealEnabled={ready} />; })}</div>)}
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
