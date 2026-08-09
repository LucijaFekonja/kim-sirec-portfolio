import { useEffect, useLayoutEffect } from "react";
import ContactContent from "./ContactContent";

export default function ContactPage({ onClose, language, onLanguageChange }) {
  useLayoutEffect(() => {
    document.body.classList.add("contact-dark");
    return () => document.body.classList.remove("contact-dark");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <button className="contact-transition-x info-page-x" type="button" onClick={onClose} aria-label="Back to homepage">
        <span />
        <span />
      </button>
      <main className="contact-page contact-transition-content info-page-content">
        <ContactContent language={language} onLanguageChange={onLanguageChange} />
      </main>
    </>
  );
}
