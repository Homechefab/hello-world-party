import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Adds a lightweight left-edge swipe -> back behavior for mobile webviews.
 * Triggers when the user starts a horizontal swipe near the left edge and
 * swipes right past a threshold. Avoids inputs and elements with
 * data-no-swipe attribute.
 */
export default function useEdgeSwipeBack() {
  const navigate = useNavigate();
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const tracking = useRef(false);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      // Only start if the gesture begins very close to the left edge
      if (t.clientX > 60) return;

      const target = e.target as HTMLElement | null;
      // don't interfere with form fields or intentionally excluded elements
      if (target) {
        const tag = (target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable) return;
        if (target.closest && (target.closest('[data-no-swipe]') || target.closest('.no-swipe'))) return;
      }

      startX.current = t.clientX;
      startY.current = t.clientY;
      tracking.current = true;
    }

    function onTouchMove(e: TouchEvent) {
      if (!tracking.current) return;
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      // If user moves mostly vertically, cancel
      if (startY.current !== null && Math.abs(t.clientY - startY.current) > 100) {
        tracking.current = false;
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!tracking.current) return;
      tracking.current = false;
      const touch = (e.changedTouches && e.changedTouches[0]) || null;
      if (!touch || startX.current === null) return;
      const deltaX = touch.clientX - startX.current;
      const deltaY = startY.current !== null ? Math.abs(touch.clientY - startY.current) : 0;

      // Require a mostly-horizontal right-swipe with enough distance
      if (deltaX > 80 && deltaY < 80) {
        // If there is history to go back to, navigate back.
        try {
          navigate(-1);
        } catch (err) {
          // fallback to window.history
          window.history.back();
        }
      }

      startX.current = null;
      startY.current = null;
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [navigate]);
}
