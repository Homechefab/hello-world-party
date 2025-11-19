import { useEffect } from "react";

/**
 * Runtime adjustment for fixed/absolute/sticky elements that sit near the
 * top of the viewport so they are not hidden under notches / Dynamic Island.
 *
 * Approach:
 * - Measure the resolved `env(safe-area-inset-top)` by creating a temporary
 *   element styled with that env() and measuring its height in pixels.
 * - Find visible elements with position fixed/absolute/sticky whose
 *   boundingClientRect.top is less than a conservative threshold near the
 *   safe area and then adjust their inline `top` to include the safe-area
 *   value (so we preserve their intended offset while adding the inset).
 * - Re-run on resize/orientationchange and when the DOM is mutated.
 */
export default function useAutoSafeArea() {
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) return;

    function measureSafeTopPx() {
      try {
        const probe = document.createElement("div");
        probe.style.position = "absolute";
        probe.style.top = "0";
        probe.style.height = "env(safe-area-inset-top, 0px)";
        probe.style.width = "0";
        probe.style.opacity = "0";
        probe.style.pointerEvents = "none";
        document.documentElement.appendChild(probe);
        const h = probe.getBoundingClientRect().height || 0;
        document.documentElement.removeChild(probe);
        return h;
      } catch (e) {
        return 0;
      }
    }

    const safeTopPx = measureSafeTopPx();
    const safeTopCss = "env(safe-area-inset-top, 0px)";

    function adjustOnce() {
      const threshold = Math.max(8, safeTopPx - 2); // elements within this top area are suspect
      const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
      all.forEach((el) => {
        if (!el.isConnected) return;
        const style = window.getComputedStyle(el);
        if (!style) return;
        const pos = style.position;
        if (pos !== "fixed" && pos !== "absolute" && pos !== "sticky") return;

        const rect = el.getBoundingClientRect();
        // Skip elements that are offscreen or invisible
        if (rect.height === 0 && rect.width === 0) return;
        if (rect.top > threshold) return;

        // avoid modifying elements that already opted out
        if (el.hasAttribute("data-no-safe-adjust") || el.classList.contains("no-safe-adjust")) return;

        // compute current CSS top value (might be 'auto')
        const currentTop = parseFloat(style.top || "0") || 0;

        // If top is 'auto' and element is inside a positioned ancestor, skip it
        if (style.top === "auto") {
          // but if the element visually overlaps the safe area, nudge it with transform instead
          if (rect.top < safeTopPx + 2) {
            // apply translateY to push it down by the measured px value
            const existing = el.style.transform || "";
            if (!existing.includes("translateY")) {
              el.style.transform = `translateY(${safeTopPx}px) ${existing}`.trim();
              el.setAttribute("data-hc-safe-applied", "transform");
            }
          }
          return;
        }

        // set a calc top combining the safe-area env() and the original offset
        // preserve existing inline style.top by basing on the numeric value
        const newTop = `calc(${safeTopCss} + ${currentTop}px)`;
        el.style.top = newTop;
        el.setAttribute("data-hc-safe-applied", "top");
      });
    }

    // Run initially and on layout changes
    adjustOnce();

    let raf = 0;
    function onResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        adjustOnce();
      });
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // MutationObserver to catch dynamic content appearing (sheets, toasts, etc.)
    const mo = new MutationObserver(() => {
      // debounce
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => adjustOnce());
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
}
