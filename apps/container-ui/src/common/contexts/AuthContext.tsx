import * as React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AccountInfo, InteractionStatus } from "@azure/msal-browser";
import { loginRequest, postLogoutRedirectUri } from "../config";
import { 
  Role, 
  getRoleFromGroups, 
  getAllRolesFromGroups,
  hasRouteAccess,
  hasTabAccess,
  getAllowedTabs,
} from "../config/roles";
import { 
  setDatadogUser, 
  clearDatadogUser, 
  trackAction, 
  DatadogActions,
} from "../config/datadog";

interface UserInfo {
  name: string;
  email: string;
  photoUrl: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AccountInfo | null;
  userInfo: UserInfo | null;
  // Role-based access control
  userGroups: string[];
  userRole: Role;
  userRoles: Role[];
  hasAccess: (path: string) => boolean;
  hasTabPermission: (path: string, tabKey: string) => boolean;
  getPermittedTabs: (path: string) => string[] | null;
  isAdmin: boolean;
  // Auth functions
  loginWithSSO: () => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = inProgress !== InteractionStatus.None;
  const user = accounts[0] || null;
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [userGroups, setUserGroups] = React.useState<string[]>([]);
  const [groupsLoading, setGroupsLoading] = React.useState(false);

  // Get user's roles from ID token claims
  // Azure AD can provide roles via "roles" claim (App Roles) or "groups" claim (Security Groups)
  const loadUserGroups = React.useCallback(() => {
    if (!user || !isAuthenticated) return;

    setGroupsLoading(true);
    try {
      const idTokenClaims = user.idTokenClaims as { 
        groups?: string[];
        roles?: string[];
        _claim_names?: { groups?: string };
        _claim_sources?: Record<string, { endpoint?: string }>;
      } | undefined;
      
      // Priority 1: Check for App Roles in the "roles" claim
      if (idTokenClaims?.roles && idTokenClaims.roles.length > 0) {
        setUserGroups(idTokenClaims.roles);
        return;
      }
      
      // Priority 2: Check for Security Groups in the "groups" claim
      if (idTokenClaims?.groups && idTokenClaims.groups.length > 0) {
        setUserGroups(idTokenClaims.groups);
        return;
      }
      
      // No roles or groups found
      setUserGroups([]);
    } catch (error) {
      console.error("Error loading user roles:", error);
      setUserGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Fetch user photo from Microsoft Graph API
  const fetchUserPhoto = React.useCallback(async () => {
    if (!user || !isAuthenticated) return;

    try {
      // Get access token for Graph API
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: user,
      });

      // Fetch user photo from Graph API
      const response = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const photoUrl = URL.createObjectURL(blob);
        setUserPhoto(photoUrl);
      }
    } catch (error) {
      // Photo might not be available, that's okay
      console.debug("Could not fetch user photo:", error);
    }
  }, [instance, user, isAuthenticated]);

  // Fetch photo and load groups when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPhoto();
      loadUserGroups();
    }
  }, [isAuthenticated, user, fetchUserPhoto, loadUserGroups]);

  // Clean up blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (userPhoto) {
        URL.revokeObjectURL(userPhoto);
      }
    };
  }, [userPhoto]);

  // Derive user info from AccountInfo
  const userInfo = React.useMemo((): UserInfo | null => {
    if (!user) return null;

    return {
      name: user.name || user.username?.split("@")[0] || "User",
      email: user.username || "",
      photoUrl: userPhoto,
    };
  }, [user, userPhoto]);

  // Get user's primary role (highest privilege)
  const userRole = React.useMemo((): Role => {
    return getRoleFromGroups(userGroups);
  }, [userGroups]);

  // Get all user's roles
  const userRoles = React.useMemo((): Role[] => {
    return getAllRolesFromGroups(userGroups);
  }, [userGroups]);

  // Check if user is admin
  const isAdmin = userRole === 'admin';

  // Set Datadog user identity when authenticated and role is determined
  React.useEffect(() => {
    if (isAuthenticated && user && userRole && userRole !== 'guest') {
      setDatadogUser({
        id: user.localAccountId || user.homeAccountId || user.username,
        name: user.name || user.username?.split("@")[0] || "Unknown",
        email: user.username || "",
        role: userRole,
      });
      trackAction(DatadogActions.LOGIN_SUCCESS, { 
        role: userRole,
        email: user.username,
      });
    }
  }, [isAuthenticated, user, userRole]);

  // Check if user has access to a route
  const hasAccess = React.useCallback((path: string): boolean => {
    return hasRouteAccess(userRole, path);
  }, [userRole]);

  // Check if user has access to a specific tab
  const hasTabPermission = React.useCallback((path: string, tabKey: string): boolean => {
    return hasTabAccess(userRole, path, tabKey);
  }, [userRole]);

  // Get allowed tabs for current user on a route
  const getPermittedTabs = React.useCallback((path: string): string[] | null => {
    return getAllowedTabs(userRole, path);
  }, [userRole]);

  // SSO login function
  const loginWithSSO = React.useCallback(async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("SSO Login failed:", error);
      throw error;
    }
  }, [instance]);

  // Logout function
  const logout = React.useCallback(() => {
    if (accounts.length > 0) {
      // Track logout event and clear Datadog user
      trackAction(DatadogActions.LOGOUT, { email: accounts[0].username });
      clearDatadogUser();
      
      instance.logoutRedirect({
        account: accounts[0],
        postLogoutRedirectUri: postLogoutRedirectUri,
      });
    }
  }, [instance, accounts]);

  const value = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading: isLoading || groupsLoading,
      user,
      userInfo,
      userGroups,
      userRole,
      userRoles,
      hasAccess,
      hasTabPermission,
      getPermittedTabs,
      isAdmin,
      loginWithSSO,
      logout,
    }),
    [
      isAuthenticated, 
      isLoading, 
      groupsLoading,
      user, 
      userInfo, 
      userGroups,
      userRole,
      userRoles,
      hasAccess,
      hasTabPermission,
      getPermittedTabs,
      isAdmin,
      loginWithSSO, 
      logout
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
