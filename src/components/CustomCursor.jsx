import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const show = () => ref.current?.classList.remove("cursor-hidden");
    const hide = () => ref.current?.classList.add("cursor-hidden");
    const move = ({ clientX, clientY, target }) => {
      ref.current.style.left = `${clientX}px`;
      ref.current.style.top = `${clientY}px`;
      ref.current.classList.toggle(
        "hovering",
        Boolean(
          target?.closest(
            ".project-hover-area, .mobile-contact-btn, .contact-transition-x, .contact-links a, .footer a, .contact-lang-btn, .viewer-arrow, .legal-close",
          ),
        ),
      );
      show();
    };
    document.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
    };
  }, []);
  return <div className="custom-cursor" id="cursor" ref={ref} />;
}
