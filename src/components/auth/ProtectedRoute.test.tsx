import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Routes are language-prefixed (/:lang); ProtectedRoute redirects to
// /<lang>/login when unauthenticated (via addLanguageToPath).
function renderWithRouter(initialPath = '/en/protected') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/:lang/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/:lang/protected" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while auth is being determined', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    renderWithRouter();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has accessible loading indicator', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    renderWithRouter();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to /login when no user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderWithRouter();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders child route content when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { uid: '123', email: 'test@test.com' }, loading: false });
    renderWithRouter();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
