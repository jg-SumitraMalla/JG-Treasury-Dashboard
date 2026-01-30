import { Configuration, LogLevel } from "@azure/msal-browser";
import { redirectUri, postLogoutRedirectUri } from "./environment";

/**
 * MSAL Configuration for Azure AD SSO
 * 
 * Application ID: 78664e94-8333-46c9-a728-820634883927
 * Directory ID: ec302311-a76e-4d47-bdb2-f537e3ae027e
 * 
 * Redirect URIs are configured in src/config/environment.ts
 * and are automatically selected based on the build environment.
 */

// Azure AD configuration
const AZURE_AD_CLIENT_ID = "78664e94-8333-46c9-a728-820634883927";
const AZURE_AD_TENANT_ID = "ec302311-a76e-4d47-bdb2-f537e3ae027e";

export const msalConfig: Configuration = {
  auth: {
    clientId: AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}`,
    redirectUri: redirectUri,
    postLogoutRedirectUri: postLogoutRedirectUri,
    navigateToLoginRequestUrl: false, // We'll handle navigation ourselves
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes for SSO login
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Optional scopes for MS Graph API if needed later
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
