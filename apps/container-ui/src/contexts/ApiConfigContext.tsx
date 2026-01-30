import * as React from "react";
import { 
  apiBaseUrl as envApiBaseUrl, 
  currentEnvironment, 
  type Environment 
} from "../config/environment";

/**
 * API Configuration Context
 * 
 * Provides the API base URL from the environment configuration.
 * The environment is determined at build time by VITE_APP_ENV:
 * - local: http://localhost:9000
 * - development: https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net
 * - production: https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net
 */

interface ApiConfigContextType {
  apiBaseUrl: string;
  environment: Environment;
}

const ApiConfigContext = React.createContext<ApiConfigContextType | undefined>(
  undefined,
);

export const ApiConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = React.useMemo(
    () => ({
      apiBaseUrl: envApiBaseUrl,
      environment: currentEnvironment,
    }),
    [],
  );

  return (
    <ApiConfigContext.Provider value={value}>
      {children}
    </ApiConfigContext.Provider>
  );
};

export const useApiConfig = (): ApiConfigContextType => {
  const context = React.useContext(ApiConfigContext);
  if (!context) {
    throw new Error("useApiConfig must be used within ApiConfigProvider");
  }
  return context;
};

// Re-export Environment type for convenience
export type { Environment };
