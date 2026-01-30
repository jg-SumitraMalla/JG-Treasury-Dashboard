/**
 * Security Groups / App Roles Configuration
 * 
 * Azure AD App Roles for role-based access control.
 * These role names are returned in the "roles" claim of the ID token.
 */

// Security Group IDs from Azure AD (for reference)
export const SECURITY_GROUPS = {
  ADMIN: '4577aa75-5ffa-4358-a22b-4b25eab31a3d',
  PM: 'a9d4d34e-c890-4852-b933-4e427c74627c',
  TREASURY_TENANT: 'a6cf922c-edf8-4340-85c5-5ee3a226137f',
} as const;

// App Role Names as they appear in the token's "roles" claim
export const APP_ROLE_NAMES = {
  ADMIN: 'apac-central-dashboard-admin',
  PM: 'apac-central-dashboard-pm',
  TREASURY_TENANT: 'apac-central-dashboard-treasury-tenant',
} as const;

// Role types
export type Role = 'admin' | 'pm' | 'treasury_tenant' | 'guest';

// Map App Role names to internal roles
export const APP_ROLE_TO_ROLE: Record<string, Role> = {
  [APP_ROLE_NAMES.ADMIN]: 'admin',
  [APP_ROLE_NAMES.PM]: 'pm',
  [APP_ROLE_NAMES.TREASURY_TENANT]: 'treasury_tenant',
};

// Map security group IDs to roles (for backwards compatibility)
export const GROUP_TO_ROLE: Record<string, Role> = {
  [SECURITY_GROUPS.ADMIN]: 'admin',
  [SECURITY_GROUPS.PM]: 'pm',
  [SECURITY_GROUPS.TREASURY_TENANT]: 'treasury_tenant',
};

// Route permissions configuration
export interface RoutePermission {
  path: string;
  allowedRoles: Role[];
  // For tabs within a route
  tabs?: Record<string, Role[]>;
}

// Define which routes each role can access
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Homepage - accessible to all authenticated users (including PM)
  {
    path: '/homepage',
    allowedRoles: ['admin', 'treasury_tenant'],
  },
  // Settings - accessible to all authenticated users
  {
    path: '/settings',
    allowedRoles: ['admin'],
  },
  {
    path: '/treasury/pnl-dashboard',
    allowedRoles: ['admin', 'treasury_tenant', 'pm'],
  },
];

/**
 * Get the user's role based on their App Roles or group memberships
 * Returns the highest privilege role if user has multiple roles
 * Supports both App Role names (from "roles" claim) and Group IDs (from "groups" claim)
 */
export const getRoleFromGroups = (rolesOrGroups: string[]): Role => {
  // Check in order of privilege (highest first)
  // Check App Role names
  if (rolesOrGroups.includes(APP_ROLE_NAMES.ADMIN)) {
    return 'admin';
  }
  // Check Group IDs (backwards compatibility)
  if (rolesOrGroups.includes(SECURITY_GROUPS.ADMIN)) {
    return 'admin';
  }
  
  // Treasury Tenant
  if (rolesOrGroups.includes(APP_ROLE_NAMES.TREASURY_TENANT)) {
    return 'treasury_tenant';
  }
  if (rolesOrGroups.includes(SECURITY_GROUPS.TREASURY_TENANT)) {
    return 'treasury_tenant';
  }
  
  // PM
  if (rolesOrGroups.includes(APP_ROLE_NAMES.PM)) {
    return 'pm';
  }
  if (rolesOrGroups.includes(SECURITY_GROUPS.PM)) {
    return 'pm';
  }
  
  return 'guest';
};

/**
 * Get all roles for a user based on their App Roles or group memberships
 * Supports both App Role names (from "roles" claim) and Group IDs (from "groups" claim)
 */
export const getAllRolesFromGroups = (rolesOrGroups: string[]): Role[] => {
  const roles: Role[] = [];
  
  // Check for Admin
  if (rolesOrGroups.includes(APP_ROLE_NAMES.ADMIN) || rolesOrGroups.includes(SECURITY_GROUPS.ADMIN)) {
    roles.push('admin');
  }
  
  // Check for PM
  if (rolesOrGroups.includes(APP_ROLE_NAMES.PM) || rolesOrGroups.includes(SECURITY_GROUPS.PM)) {
    roles.push('pm');
  }
  
  // Check for Treasury Tenant
  if (rolesOrGroups.includes(APP_ROLE_NAMES.TREASURY_TENANT) || rolesOrGroups.includes(SECURITY_GROUPS.TREASURY_TENANT)) {
    roles.push('treasury_tenant');
  }
  
  if (roles.length === 0) {
    roles.push('guest');
  }
  
  return roles;
};

/**
 * Check if a role has access to a specific route
 */
export const hasRouteAccess = (role: Role, path: string): boolean => {
  // Admin has access to everything
  if (role === 'admin') return true;
  
  const permission = ROUTE_PERMISSIONS.find(p => 
    path.startsWith(p.path) || path === p.path
  );
  
  if (!permission) {
    // If route is not defined, deny access (except for admin)
    return false;
  }
  
  return permission.allowedRoles.includes(role);
};

/**
 * Check if a role has access to a specific tab within a route
 */
export const hasTabAccess = (role: Role, path: string, tabKey: string): boolean => {
  // Admin has access to everything
  if (role === 'admin') return true;
  
  const permission = ROUTE_PERMISSIONS.find(p => 
    path.startsWith(p.path) || path === p.path
  );
  
  if (!permission) return false;
  
  // If no tab permissions defined, use route-level permissions
  if (!permission.tabs) {
    return permission.allowedRoles.includes(role);
  }
  
  const tabRoles = permission.tabs[tabKey];
  if (!tabRoles) {
    // If specific tab not defined, use route-level permissions
    return permission.allowedRoles.includes(role);
  }
  
  return tabRoles.includes(role);
};

/**
 * Get allowed tabs for a role on a specific route
 */
export const getAllowedTabs = (role: Role, path: string): string[] | null => {
  // Admin has access to everything
  if (role === 'admin') return null; // null means all tabs allowed
  
  const permission = ROUTE_PERMISSIONS.find(p => 
    path.startsWith(p.path) || path === p.path
  );
  
  if (!permission?.tabs) return null;
  
  return Object.entries(permission.tabs)
    .filter(([, roles]) => roles.includes(role))
    .map(([tab]) => tab);
};

