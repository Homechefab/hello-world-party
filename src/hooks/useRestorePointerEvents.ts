import { useEffect } from 'react';

const RADIX_OPEN_SELECTORS = [
  '[data-radix-popper-content-wrapper]',
  '[data-state="open"][role="dialog"]',
  '[data-state="open"][role="menu"]',
  '[data-state="open"][role="listbox"]',
].join(',');

export default function useRestorePointerEvents() {
  useEffect(() => {
    const restoreIfStale = () => {
      if (document.body.style.pointerEvents !== 'none') return;
      if (document.querySelector(RADIX_OPEN_SELECTORS)) return;

      document.body.style.pointerEvents = '';
    };

    window.addEventListener('click', restoreIfStale, true);
    window.addEventListener('touchend', restoreIfStale, true);
    window.addEventListener('popstate', restoreIfStale);

    const intervalId = window.setInterval(restoreIfStale, 500);
    const observer = new MutationObserver(restoreIfStale);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    restoreIfStale();

    return () => {
      window.removeEventListener('click', restoreIfStale, true);
      window.removeEventListener('touchend', restoreIfStale, true);
      window.removeEventListener('popstate', restoreIfStale);
      window.clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);
}