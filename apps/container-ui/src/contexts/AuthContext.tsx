import * as React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AccountInfo, InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../config/msalConfig";
import { postLogoutRedirectUri } from "../config/environment";

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

  // Fetch photo when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPhoto();
    }
  }, [isAuthenticated, user, fetchUserPhoto]);

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
      instance.logoutRedirect({
        account: accounts[0],
        postLogoutRedirectUri: postLogoutRedirectUri,
      });
    }
  }, [instance, accounts]);

  const value = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      userInfo,
      loginWithSSO,
      logout,
    }),
    [isAuthenticated, isLoading, user, userInfo, loginWithSSO, logout],
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
