import { useEffect } from "react";
import { Link } from "react-router-dom";
import { bioTranslations, legalDocuments } from "../translations";

export function InstagramIcon({ size = 18 }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>;
}

export default function ContactContent({ language, onLanguageChange }) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const rotateCursor = (rotating) => {
    document.getElementById("cursor")?.classList.toggle("hovering", rotating);
  };

  const cursorRotationHandlers = {
    onMouseEnter: () => rotateCursor(true),
    onMouseLeave: () => rotateCursor(false),
  };

  return <div className="contact-content">
    <section className="contact-hero">
      <h1 className="contact-name">Kim Širec Photography</h1>
      <p className="contact-bio" data-i18n="bio">{bioTranslations[language]}</p>
      <div className="contact-links">
        <div className="contact-link-group">
          <h2>Direct</h2>
          <a href="mailto:kim.sirec100@gmail.com">kim.sirec100@gmail.com</a>
        </div>
        <div className="contact-link-group">
          <h2>{language === "de" ? "Verbinden" : "Link up"}</h2>
          <a href="https://instagram.com/sladkomleko/" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
          {/* <InstagramIcon /> */}
        </div>
      </div>
    </section>
    <footer className="contact-footer">
      <div className="contact-language-switch" aria-label="Language switcher">
        <button type="button" className={`contact-lang-btn${language === "en" ? " active" : ""}`} onClick={() => onLanguageChange("en")} aria-pressed={language === "en"}>EN</button>
        <span className="contact-lang-separator">/</span>
        <button type="button" className={`contact-lang-btn${language === "de" ? " active" : ""}`} onClick={() => onLanguageChange("de")} aria-pressed={language === "de"}>DE</button>
      </div>
      <nav className="contact-legal" aria-label="Legal">
        <Link to="/privacy-policy" {...cursorRotationHandlers}>{legalDocuments[language].privacy.linkLabel}</Link>
        <span aria-hidden="true">·</span>
        <Link to="/terms-and-conditions" {...cursorRotationHandlers}>{legalDocuments[language].terms.linkLabel}</Link>
      </nav>
      <p className="contact-credit">Site by Kim Širec, <a className="developer-signature" href="https://github.com/LucijaFekonja" target="_blank" rel="noreferrer" {...cursorRotationHandlers}>Lucija Fekonja</a>, 2026 © all rights reserved</p>
    </footer>
  </div>;
}
