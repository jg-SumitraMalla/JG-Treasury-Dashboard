/**
 * Environment Configuration
 * 
 * This file manages environment-specific settings for the application.
 * The environment is determined by the VITE_APP_ENV variable or defaults to 'local'.
 * 
 * Environments:
 * - local: Local development (localhost:3000 for UI, localhost:9000 for API)
 * - development: Development server (tech1dev.jainglobal.net)
 * - production: Production server (tech1prod.jainglobal.net)
 * 
 * Build commands:
 * - Local development: npm run dev (uses 'local' config)
 * - Dev environment build: npm run build:dev (uses 'development' config)
 * - Production build: npm run build:prod (uses 'production' config)
 */

export type Environment = 'local' | 'development' | 'production';

interface EnvironmentConfig {
  // UI base URL (where the frontend is hosted)
  baseUrl: string;
  // Azure AD redirect URIs
  redirectUri: string;
  postLogoutRedirectUri: string;
  // API base URL (backend FastAPI endpoint)
  apiBaseUrl: string;
}

const getLocalBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

// Environment configurations
const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseUrl: getLocalBaseUrl(),
    redirectUri: `${getLocalBaseUrl()}/ui/auth/callback`,
    postLogoutRedirectUri: `${getLocalBaseUrl()}/ui/login`,
    apiBaseUrl: 'http://localhost:9000',
  },
  development: {
    baseUrl: 'https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net',
    redirectUri: 'https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net/ui/auth/callback',
    postLogoutRedirectUri: 'https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net/ui/login',
    apiBaseUrl: 'https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net',
  },
  production: {
    baseUrl: 'https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net',
    redirectUri: 'https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net/ui/auth/callback',
    postLogoutRedirectUri: 'https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net/ui/login',
    apiBaseUrl: 'https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net',
  },
};

// Get current environment from Vite's import.meta.env
// Set via: VITE_APP_ENV=development npm run build
const getCurrentEnvironment = (): Environment => {
  const env = import.meta.env.VITE_APP_ENV as Environment | undefined;
  
  if (env && environments[env]) {
    return env;
  }
  
  // Default to 'local' for development mode
  if (import.meta.env.DEV) {
    return 'local';
  }
  
  // For production builds without VITE_APP_ENV, try to detect from URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'local';
    }
    
    // Development environment
    if (hostname.includes('tech1dev')) {
      return 'development';
    }
    
    // Production environment
    if (hostname.includes('tech1prod')) {
      return 'production';
    }
  }
  
  // Default to local if we can't determine
  return 'local';
};

export const currentEnvironment = getCurrentEnvironment();
export const envConfig = environments[currentEnvironment];

// Export individual config values for convenience
export const { baseUrl, redirectUri, postLogoutRedirectUri, apiBaseUrl } = envConfig;

// Helper to get environment display info
export const getEnvironmentInfo = () => ({
  name: currentEnvironment,
  displayName: currentEnvironment.charAt(0).toUpperCase() + currentEnvironment.slice(1),
  color: currentEnvironment === 'local' ? 'blue' : 
         currentEnvironment === 'development' ? 'orange' : 'green',
  isLocal: currentEnvironment === 'local',
  isDevelopment: currentEnvironment === 'development',
  isProduction: currentEnvironment === 'production',
});

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log(`[Environment] Running in '${currentEnvironment}' mode`);
  console.log(`[Environment] Base URL: ${baseUrl}`);
  console.log(`[Environment] API URL: ${apiBaseUrl}`);
}
