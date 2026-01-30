import * as React from "react";
import { useLocation } from "react-router-dom";
import { Result, Button } from "antd";
import { useAuth } from "../contexts/AuthContext";
import type { Role } from "../config/roles";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

/**
 * Route protection component that checks user roles
 * 
 * Usage:
 * <RoleProtectedRoute allowedRoles={['admin', 'treasury_tenant']}>
 *   <YourComponent />
 * </RoleProtectedRoute>
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children,
  allowedRoles,
  redirectTo = '/homepage',
}) => {
  const { hasAccess, userRole, isAdmin } = useAuth();
  const location = useLocation();

  // If specific roles are provided, check against them
  if (allowedRoles && allowedRoles.length > 0) {
    // Admin always has access
    if (!isAdmin && !allowedRoles.includes(userRole)) {
      return (
        <Result
          status="403"
          title="Access Denied"
          subTitle="You don't have permission to access this page."
          extra={
            <Button type="primary" href={redirectTo}>
              Go to Homepage
            </Button>
          }
        />
      );
    }
  } else {
    // Use route-based permission checking
    if (!hasAccess(location.pathname)) {
      return (
        <Result
          status="403"
          title="Access Denied"
          subTitle="You don't have permission to access this page."
          extra={
            <Button type="primary" href={redirectTo}>
              Go to Homepage
            </Button>
          }
        />
      );
    }
  }

  return <>{children}</>;
};

/**
 * Higher-order component version of RoleProtectedRoute
 */
export const withRoleProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: Role[],
): React.FC<P> => {
  const WithRoleProtection: React.FC<P> = (props) => (
    <RoleProtectedRoute allowedRoles={allowedRoles}>
      <WrappedComponent {...props} />
    </RoleProtectedRoute>
  );
  
  WithRoleProtection.displayName = `WithRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithRoleProtection;
};

