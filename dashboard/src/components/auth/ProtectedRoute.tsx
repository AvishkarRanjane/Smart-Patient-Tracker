// components/auth/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Permission, UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict Family Isolation: Family members cannot access staff/clinical routes
  if (user.role === 'family' && location.pathname !== '/family') {
    return <Navigate to="/family" replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'family') {
      return <Navigate to="/family" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check granular permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>Your account ({user.roleTitle}) does not have permission to view this section.</p>
      </div>
    );
  }

  return <>{children}</>;
}
