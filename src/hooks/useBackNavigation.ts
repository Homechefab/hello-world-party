import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Returns helpers for a global "back" button.
 *
 * - `showBack` is true on every route except the home route (`/`).
 * - `goBack` navigates one entry back in the SPA history when possible.
 *   When the user landed directly on this URL (deep-link, refresh, push
 *   notification, auth redirect that replaced history), `location.key` is
 *   `'default'` and we navigate to `/` instead — this prevents the user
 *   from being kicked out of the app.
 */
export function useBackNavigation(homePath: string = '/') {
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== homePath && location.pathname !== '';

  const goBack = useCallback(() => {
    if (location.key && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(homePath);
    }
  }, [navigate, location.key, homePath]);

  return { showBack, goBack };
}
