import { Navigate, Outlet, useParams } from 'react-router-dom';
import { addLanguageToPath } from '@sudobility/components';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard that restricts access to authenticated users.
 * Shows a loading indicator while auth state is being determined,
 * redirects to `/login` if no user is authenticated, and renders
 * child routes via `<Outlet />` when the user is signed in.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { lang } = useParams<{ lang: string }>();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Checking authentication"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={addLanguageToPath('/login', lang || 'en')} replace />;
  }

  return <Outlet />;
}
