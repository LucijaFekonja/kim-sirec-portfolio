import { useEffect, useRef, useState } from "react";
import { localizeProject } from "../translations";

const revealedProjects = new Set();

export default function ProjectCard({ project, projectIndex, language, isMobile, onOpen, transitionName, revealEnabled }) {
  const cardRef = useRef(null);
  const hoverAreaRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dimensions, setDimensions] = useState(null);
  const [revealed, setRevealed] = useState(() => revealedProjects.has(project.cover));
  const offset = isMobile ? (project.offsetMobile || { x: 0, y: 0 }) : dimensions?.height > dimensions?.width ? (project.offsetPortrait || project.offsetLandscape || { x: 0, y: 0 }) : (project.offsetLandscape || { x: 0, y: 0 });
  const cardStyle = {
    viewTransitionName: transitionName,
    "--reveal-delay": `${(projectIndex % 2) * 70}ms`,
    ...(isMobile ? {} : { transform: `translate(${offset.x}px, ${offset.y}px)` }),
  };
  const sizeStyle = isMobile ? undefined : { maxWidth: project.maxWidth, maxHeight: project.maxHeight };
  const localizedProject = localizeProject(project, projectIndex, language);

  useEffect(() => {
    if (!revealEnabled || revealed) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealedProjects.add(project.cover);
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      revealedProjects.add(project.cover);
      setRevealed(true);
      observer.disconnect();
    }, {
      root: isMobile ? null : cardRef.current?.closest("#scrollContainer"),
      rootMargin: isMobile ? "0px" : "0px 0px -25% 0px",
      threshold: isMobile ? 0.15 : 0,
    });

    observer.observe(hoverAreaRef.current);
    return () => observer.disconnect();
  }, [isMobile, project.cover, revealEnabled, revealed]);

  return <div className={`project-card ${revealed ? "revealed" : "reveal-pending"}`} style={cardStyle} ref={cardRef}>
    <div className="project-hover-area" ref={hoverAreaRef} onClick={(event) => !event.target.closest(".img-dot") && onOpen(localizedProject, activeIndex, setActiveIndex)}>
      <div className="project-img-wrap" style={sizeStyle}>
        <img className="project-img" src={`/${project.images[activeIndex]}`} alt={localizedProject.name} style={sizeStyle} onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} />
      </div>
      <div className="img-dots">{project.images.map((_, index) => <button key={index} className={`img-dot${index === activeIndex ? " active" : ""}`} type="button" aria-label={`Show image ${index + 1} of ${project.images.length}`} onClick={(event) => { event.stopPropagation(); setActiveIndex(index); }} />)}</div>
      <div className="img-caption"><div className="img-caption-line1">{localizedProject.name}{localizedProject.location ? `, ${localizedProject.location}` : ""}</div><div className="img-caption-line2">{localizedProject.author || ""}</div></div>
    </div>
  </div>;
}
