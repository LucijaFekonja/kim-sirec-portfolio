import { useEffect } from "react";
import { bioTranslations } from "../translations";

export function InstagramIcon({ size = 18 }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>;
}

export default function ContactContent({ language, onLanguageChange }) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <div className="contact-content">
    <h1 className="contact-name">Kim Širec</h1>
    <p className="contact-bio" data-i18n="bio">{bioTranslations[language]}</p>
    <p className="contact-break-line" />
    <div className="contact-links"><a href="mailto:kim.sirec100@gmail.com">kim.sirec100@gmail.com</a><a href="https://instagram.com/sladkomleko/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a></div>
    <div className="contact-language-switch" aria-label="Language switcher">
      <button type="button" className={`contact-lang-btn${language === "en" ? " active" : ""}`} onClick={() => onLanguageChange("en")} aria-pressed={language === "en"}>EN</button>
      <span className="contact-lang-separator">/</span>
      <button type="button" className={`contact-lang-btn${language === "de" ? " active" : ""}`} onClick={() => onLanguageChange("de")} aria-pressed={language === "de"}>DE</button>
    </div>
  </div>;
}
