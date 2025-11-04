import { Navigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { Loading } from '@presentation/components/Loading/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('GUEST' | 'RECEPTIONIST' | 'ADMIN')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/search" replace />;
  }

  return <>{children}</>;
};