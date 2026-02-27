import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
