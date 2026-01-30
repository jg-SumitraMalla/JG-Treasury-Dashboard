/**
 * Health Check Service Functions
 * 
 * Common service functions for checking API health status.
 * Used across all business verticals.
 * 
 * API URLs by environment (set at build time via VITE_APP_ENV):
 * - local: http://localhost:9000
 * - development: https://apac-rpm-fastapi-dev.tech1dev.jainglobal.net
 * - production: https://apac-rpm-fastapi-prod.tech1prod.jainglobal.net
 */

import type {
  FastAPIHealthResponse,
  FastAPIReadyResponse,
  FastAPILiveResponse,
} from "../types/common";
import { apiBaseUrl } from "../config/environment";

/**
 * Gets the current API base URL from environment configuration
 */
export const getApiBaseUrl = (): string => {
  return apiBaseUrl;
};

/**
 * FastAPI Server Health Check - GET /healthz
 * Comprehensive health check for K8s liveness/readiness probe
 */
export const getFastAPIHealth = async (): Promise<FastAPIHealthResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/healthz`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get FastAPI health status");
  }

  return response.json();
};

/**
 * FastAPI Server Readiness Check - GET /readyz
 * K8s readiness probe - checks if service is ready to accept traffic
 */
export const getFastAPIReady = async (): Promise<FastAPIReadyResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/readyz`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Return not_ready status for non-OK responses
    return {
      status: "not_ready",
      database: "not_connected",
    };
  }

  return response.json();
};

/**
 * FastAPI Server Liveness Check - GET /livez
 * K8s liveness probe - simple alive check
 */
export const getFastAPILive = async (): Promise<FastAPILiveResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/livez`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("FastAPI server is not alive");
  }

  return response.json();
};
