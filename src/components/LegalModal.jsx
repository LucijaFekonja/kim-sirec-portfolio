import { useEffect, useRef } from "react";
import { legalDocuments } from "../translations";

export default function LegalModal({ type, language, onClose }) {
  const dialogRef = useRef(null);
  const legalDocument = legalDocuments[language][type];

  useEffect(() => {
    document.body.classList.add("legal-open");
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("legal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="legal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="legal-dialog" role="dialog" aria-modal="true" aria-labelledby={`legal-${type}-title`} tabIndex="-1" ref={dialogRef}>
        <button className="legal-close" type="button" aria-label="Close" onClick={onClose}><span /><span /></button>
        <header className="legal-header">
          <h1 id={`legal-${type}-title`}>{legalDocument.title}</h1>
          <p>{legalDocument.updated}</p>
        </header>
        <div className="legal-content">
          {legalDocument.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
