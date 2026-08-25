import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const show = () => ref.current?.classList.remove("cursor-hidden");
    const hide = () => ref.current?.classList.add("cursor-hidden");
    const move = ({ clientX, clientY, target }) => {
      const infoDot = document.querySelector(".mobile-info-dot");
      const dotRect = infoDot?.getBoundingClientRect();
      const cursorRadius = 4.5;
      const overlapsInfoDot = dotRect
        ? Math.hypot(
            clientX - (dotRect.left + dotRect.width / 2),
            clientY - (dotRect.top + dotRect.height / 2),
          ) <= cursorRadius + dotRect.width / 2
        : false;

      ref.current.style.left = `${clientX}px`;
      ref.current.style.top = `${clientY}px`;
      ref.current.classList.toggle(
        "hovering",
        Boolean(
          target?.closest(
            ".project-hover-area, .mobile-contact-btn, .theme-switch, .scroll-to-top, .contact-transition-x, .contact-links a, .contact-legal a, .contact-credit .developer-signature, .footer a, .contact-lang-btn, .viewer-arrow, .legal-close",
          ),
        ),
      );
      ref.current.classList.toggle(
        "over-info-dot",
        overlapsInfoDot,
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
