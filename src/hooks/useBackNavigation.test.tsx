import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useBackNavigation } from './useBackNavigation';

/**
 * A tiny probe component that uses the hook and exposes its values + actions
 * via data attributes / a click target — easier to assert against than mocks.
 */
function BackProbe() {
  const { showBack, goBack } = useBackNavigation('/');
  const location = useLocation();
  return (
    <div>
      <span data-testid="path">{location.pathname}</span>
      <span data-testid="key">{location.key}</span>
      <span data-testid="show-back">{showBack ? 'yes' : 'no'}</span>
      <button type="button" onClick={goBack} data-testid="back-btn">
        back
      </button>
    </div>
  );
}

/** Helper to trigger an in-app navigation from the test. */
function NavigateOnMount({ to, replace = false }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function renderApp(initialEntries: string[], initialIndex?: number) {
  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      initialIndex={initialIndex ?? initialEntries.length - 1}
    >
      <Routes>
        <Route path="/" element={<BackProbe />} />
        <Route path="/about" element={<BackProbe />} />
        <Route path="/chef/:id" element={<BackProbe />} />
        <Route path="/auth" element={<BackProbe />} />
        <Route path="/dashboard" element={<BackProbe />} />
        {/* Helper routes used to drive navigation from inside the router */}
        <Route path="/_go/:dest" element={<GoHelper />} />
      </Routes>
    </MemoryRouter>,
  );
}

function GoHelper() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const dest = location.pathname.replace('/_go', '');
    navigate(dest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe('useBackNavigation', () => {
  it('hides the back button on the home route', () => {
    renderApp(['/']);
    expect(screen.getByTestId('show-back')).toHaveTextContent('no');
  });

  it('shows the back button on every non-home route', () => {
    renderApp(['/about']);
    expect(screen.getByTestId('show-back')).toHaveTextContent('yes');

    renderApp(['/chef/123']);
    expect(screen.getAllByTestId('show-back')[1]).toHaveTextContent('yes');
  });

  it('on a deep-link (first entry), goBack navigates to home instead of leaving the app', () => {
    // Single history entry → location.key === 'default'
    renderApp(['/chef/abc']);
    expect(screen.getByTestId('path')).toHaveTextContent('/chef/abc');
    expect(screen.getByTestId('key')).toHaveTextContent('default');

    act(() => {
      screen.getByTestId('back-btn').click();
    });

    expect(screen.getByTestId('path')).toHaveTextContent('/');
  });

  it('after an in-app navigation, goBack returns to the previous SPA entry', () => {
    // Start on home, then navigate to /about via a real router push.
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><BackProbe /><NavigateOnMount to="/about" /></>} />
          <Route path="/about" element={<BackProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    // After the push effect we should be on /about with a non-default key.
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
    expect(screen.getByTestId('key').textContent).not.toBe('default');

    act(() => {
      screen.getByTestId('back-btn').click();
    });

    expect(screen.getByTestId('path')).toHaveTextContent('/');
    expect(container).toBeTruthy();
  });

  it('after an auth redirect that uses replace, treats the redirected page like a deep-link', () => {
    // Simulates: user lands on /auth, code calls navigate('/dashboard', { replace: true }).
    // The replaced entry keeps the initial 'default' key, so back should go home.
    render(
      <MemoryRouter initialEntries={['/auth']}>
        <Routes>
          <Route
            path="/auth"
            element={<><BackProbe /><NavigateOnMount to="/dashboard" replace /></>}
          />
          <Route path="/dashboard" element={<BackProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('path')).toHaveTextContent('/dashboard');

    act(() => {
      screen.getByTestId('back-btn').click();
    });

    // Should NOT bounce back to /auth (that's the whole point of replace).
    expect(screen.getByTestId('path')).not.toHaveTextContent('/auth');
    expect(screen.getByTestId('path')).toHaveTextContent('/');
  });

  it('multi-step in-app navigation: back goes one step at a time', () => {
    // Use explicit user-driven nav (links) instead of chained mount effects
    // so we control exactly when each navigation happens.
    function LinkProbe({ to }: { to: string }) {
      const navigate = useNavigate();
      const { showBack, goBack } = useBackNavigation('/');
      const location = useLocation();
      return (
        <div>
          <span data-testid="path">{location.pathname}</span>
          <span data-testid="show-back">{showBack ? 'yes' : 'no'}</span>
          <button data-testid="go" onClick={() => navigate(to)}>go</button>
          <button data-testid="back-btn" onClick={goBack}>back</button>
        </div>
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LinkProbe to="/about" />} />
          <Route path="/about" element={<LinkProbe to="/chef/123" />} />
          <Route path="/chef/:id" element={<LinkProbe to="/" />} />
        </Routes>
      </MemoryRouter>,
    );

    // / -> /about -> /chef/123
    act(() => { screen.getByTestId('go').click(); });
    expect(screen.getByTestId('path')).toHaveTextContent('/about');

    act(() => { screen.getByTestId('go').click(); });
    expect(screen.getByTestId('path')).toHaveTextContent('/chef/123');

    // back: /chef/123 -> /about -> /
    act(() => { screen.getByTestId('back-btn').click(); });
    expect(screen.getByTestId('path')).toHaveTextContent('/about');

    act(() => { screen.getByTestId('back-btn').click(); });
    expect(screen.getByTestId('path')).toHaveTextContent('/');
    expect(screen.getByTestId('show-back')).toHaveTextContent('no');
  });
});
