import { useEffect, useRef } from "react";

const WHEEL_THRESHOLD = 90;
const WHEEL_IDLE_TIME = 160;
const WHEEL_NAVIGATION_COOLDOWN = 500;
const TOUCH_THRESHOLD = 45;

export default function Viewer({ state, setState }) {
  const viewerRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const wheelGesture = useRef({ totalX: 0, lastEventAt: 0, lastMagnitude: 0, locked: false });
  const wheelResetTimer = useRef();
  const nativeBackBlocked = useRef(false);
  const nativeBackReleaseTimer = useRef();
  const stateRef = useRef(state);
  stateRef.current = state;

  const { project, index, onClose } = state;
  const open = Boolean(project);
  const images = project?.images || [];

  const forceClose = () => {
    const current = stateRef.current;
    current.onClose?.(current.index);
    setState({ project: null, index: 0, onClose: null });
  };

  const close = () => {
    if (history.state?.viewerOpen) history.back();
    else forceClose();
  };

  const move = (delta) => {
    setState((current) => current.project ? {
      ...current,
      index: Math.max(0, Math.min(current.project.images.length - 1, current.index + delta)),
    } : current);
  };

  const movePrevious = () => move(-1);

  const blockNativeBackUntilGestureEnds = () => {
    nativeBackBlocked.current = true;
    window.clearTimeout(nativeBackReleaseTimer.current);
    nativeBackReleaseTimer.current = window.setTimeout(() => {
      nativeBackBlocked.current = false;
    }, WHEEL_IDLE_TIME);
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    const gesture = wheelGesture.current;
    const now = performance.now();
    const deltaX = event.deltaX * (event.deltaMode === 1 ? 16 : 1);
    const magnitude = Math.abs(deltaX);

    // On photo one, leave a new previous-direction gesture untouched so the
    // browser can perform its native back navigation. Momentum from a gesture
    // that arrived here from another photo remains contained in the viewer.
    if (deltaX < 0 && stateRef.current.index === 0) {
      if (nativeBackBlocked.current) {
        event.preventDefault();
        blockNativeBackUntilGestureEnds();
      }
      return;
    }

    event.preventDefault();

    if (gesture.locked) {
      // Momentum decays; a sudden increase identifies a new deliberate swipe
      // and unlocks immediately, even in the same direction.
      const isFreshImpulse = magnitude >= 4 && magnitude > gesture.lastMagnitude * 1.8;
      gesture.lastMagnitude = magnitude;
      if (!isFreshImpulse) return;
      window.clearTimeout(wheelResetTimer.current);
      gesture.locked = false;
      gesture.totalX = 0;
    }

    if (now - gesture.lastEventAt > WHEEL_IDLE_TIME) {
      gesture.totalX = 0;
    }

    gesture.lastEventAt = now;
    gesture.lastMagnitude = magnitude;
    gesture.totalX += deltaX;

    const lockAfterNavigation = () => {
      gesture.locked = true;
      gesture.totalX = 0;
      window.clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = window.setTimeout(() => {
        wheelGesture.current = { totalX: 0, lastEventAt: 0, lastMagnitude: 0, locked: false };
      }, WHEEL_NAVIGATION_COOLDOWN);
    };

    if (gesture.totalX <= -WHEEL_THRESHOLD) {
      lockAfterNavigation();
      if (stateRef.current.index === 1) blockNativeBackUntilGestureEnds();
      movePrevious();
    } else if (gesture.totalX >= WHEEL_THRESHOLD) {
      lockAfterNavigation();
      nativeBackBlocked.current = false;
      window.clearTimeout(nativeBackReleaseTimer.current);
      move(1);
    }
  };

  const handleTouchEnd = (event) => {
    const dx = touchStart.current.x - event.changedTouches[0].clientX;
    const dy = touchStart.current.y - event.changedTouches[0].clientY;

    if (Math.abs(dy) > Math.abs(dx) && dy > TOUCH_THRESHOLD) {
      close();
      return;
    }

    if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < TOUCH_THRESHOLD) return;

    if (dx > 0) move(1);
    else movePrevious();
  };

  useEffect(() => {
    if (!open) return undefined;

    document.body.classList.add("viewer-open", "project-viewer-open");
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Escape") close();
    };

    window.addEventListener("popstate", forceClose);
    document.addEventListener("keydown", handleKeyDown);
    viewerRef.current?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.classList.remove("viewer-open", "project-viewer-open");
      window.removeEventListener("popstate", forceClose);
      document.removeEventListener("keydown", handleKeyDown);
      viewerRef.current?.removeEventListener("wheel", handleWheel);
      window.clearTimeout(wheelResetTimer.current);
      window.clearTimeout(nativeBackReleaseTimer.current);
    };
  }, [open]);

  if (!open) return <><div className="viewer" id="viewer" /><div id="viewer-title-container" /></>;

  return (
    <>
      <div
        className="viewer active"
        id="viewer"
        ref={viewerRef}
        onClick={(event) => !event.target.closest(".viewer-slide img, .viewer-arrow") && close()}
        onTouchStart={(event) => {
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="viewer-track">
          {images.map((src, imageIndex) => (
            <div key={src} className={`viewer-slide${imageIndex === index ? " active" : ""}`}>
              <img src={`/${src}`} alt={`${project.name} image ${imageIndex + 1}`} />
            </div>
          ))}
        </div>
        <button className="viewer-arrow left" type="button" aria-label="Previous image" style={{ opacity: index === 0 ? 0 : 1, pointerEvents: index === 0 ? "none" : "auto" }} onClick={(event) => { event.stopPropagation(); move(-1); }}>‹</button>
        <button className="viewer-arrow right" type="button" aria-label="Next image" style={{ opacity: index === images.length - 1 ? 0 : 1, pointerEvents: index === images.length - 1 ? "none" : "auto" }} onClick={(event) => { event.stopPropagation(); move(1); }}>›</button>
      </div>
      <div id="viewer-title-container" className="active">
        <div className="viewer-title-line1">{project.name}{project.location ? `, ${project.location}` : ""}</div>
        <div className="viewer-title-line2">{project.author || ""}</div>
      </div>
    </>
  );
}
