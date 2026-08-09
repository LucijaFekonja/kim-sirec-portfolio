import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GalleryPage from "./components/GalleryPage";
import ContactPage from "./components/ContactPage";
import ContactContent from "./components/ContactContent";
import CustomCursor from "./components/CustomCursor";

const OPEN_REVEAL_DELAY = 80;
const TRANSITION_DURATION = 1000;
const OPEN_PREPARE_DELAY = 20;
const CLOSE_PREPARE_DELAY = 20;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const timers = useRef([]);
  const [transition, setTransition] = useState("idle");
  const [language, setLanguage] = useState("en");
  const legalDocument = location.pathname === "/privacy-policy"
    ? "privacy"
    : location.pathname === "/terms-and-conditions" ? "terms" : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const finishTransition = useCallback(() => {
    setTransition("idle");
    document.body.classList.remove("contact-open", "viewer-open");
  }, []);

  const openInfo = useCallback(() => {
    if (transition !== "idle" || location.pathname === "/info") return;

    clearTimers();
    document.body.classList.add("contact-open", "viewer-open");
    setTransition("opening-ready");

    timers.current.push(window.setTimeout(() => setTransition("opening"), OPEN_PREPARE_DELAY));
    timers.current.push(window.setTimeout(() => setTransition("opening-reveal"), OPEN_PREPARE_DELAY + OPEN_REVEAL_DELAY));
    timers.current.push(window.setTimeout(() => {
      navigate("/info");
      finishTransition();
    }, OPEN_PREPARE_DELAY + TRANSITION_DURATION));
  }, [clearTimers, finishTransition, location.pathname, navigate, transition]);

  const closeInfo = useCallback(() => {
    if (transition === "closing" || transition === "close-ready") return;

    clearTimers();
    document.body.classList.add("contact-open", "viewer-open");
    setTransition("close-ready");

    timers.current.push(window.setTimeout(() => {
      navigate("/", { replace: true });
      setTransition("closing");
    }, CLOSE_PREPARE_DELAY));
    timers.current.push(window.setTimeout(finishTransition, TRANSITION_DURATION + CLOSE_PREPARE_DELAY));
  }, [clearTimers, finishTransition, navigate, transition]);

  const closeLegal = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = location.pathname === "/info" ? "Kim Širec — Info" : "Kim Širec";
  }, [location.pathname, language]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("info-route", location.pathname === "/info");
  }, [location.pathname]);

  useEffect(() => () => {
    clearTimers();
    document.body.classList.remove("contact-open", "viewer-open");
  }, [clearTimers]);

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/info" element={<ContactPage onClose={closeInfo} language={language} onLanguageChange={setLanguage} />} />
        <Route path="*" element={<GalleryPage onOpenInfo={openInfo} language={language} legalDocument={legalDocument} onCloseLegal={closeLegal} />} />
      </Routes>
      <PageTransition phase={transition} onClose={closeInfo} language={language} onLanguageChange={setLanguage} />
    </>
  );
}

function PageTransition({ phase, onClose, language, onLanguageChange }) {
  if (phase === "idle") return null;

  const isExpanded = phase === "opening" || phase === "opening-reveal" || phase === "close-ready";
  const isRevealed = phase === "opening-reveal" || phase === "close-ready";
  const isClosing = phase === "closing";
  const circleClass = `page-transition-circle${isExpanded ? " active" : ""}${phase === "close-ready" ? " close-ready" : ""}${isClosing ? " closing" : ""}`;
  const isOpening = phase === "opening" || phase === "opening-reveal";
  const overlayClass = `contact-transition-overlay active${isOpening ? " transition-opening" : ""}${isRevealed ? " reveal" : ""}${isClosing ? " closing" : ""}`;

  return (
    <>
      <div className={circleClass} aria-hidden="true" />
      <div className={overlayClass} aria-hidden="false">
        <button className="contact-transition-x" type="button" aria-label="Close info page" onClick={onClose}>
          <span />
          <span />
        </button>
        <div className="contact-transition-content">
          <ContactContent language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </>
  );
}
