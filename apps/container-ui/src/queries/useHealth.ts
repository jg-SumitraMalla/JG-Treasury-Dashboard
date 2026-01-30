import { useQuery } from "@tanstack/react-query";
import {
  getFastAPIHealth,
  getFastAPIReady,
  getFastAPILive,
} from "../common/services/healthService";
import type {
  FastAPIHealthResponse,
  FastAPIReadyResponse,
  FastAPILiveResponse,
} from "../common/types/common";
import { queryKeys } from "./queryClient";

// 30 minutes in milliseconds
const THIRTY_MINUTES = 30 * 60 * 1000;

/**
 * Hook to fetch FastAPI /healthz comprehensive health status
 */
export const useFastAPIHealth = (options?: { enabled?: boolean; refetchInterval?: number | false }) => {
  return useQuery({
    queryKey: queryKeys.health.fastApi.health(),
    queryFn: getFastAPIHealth,
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval ?? THIRTY_MINUTES,
    staleTime: THIRTY_MINUTES,
    retry: 1,
  });
};

/**
 * Hook to fetch FastAPI /readyz readiness status
 */
export const useFastAPIReady = (options?: { enabled?: boolean; refetchInterval?: number | false }) => {
  return useQuery({
    queryKey: queryKeys.health.fastApi.ready(),
    queryFn: getFastAPIReady,
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval ?? THIRTY_MINUTES,
    staleTime: THIRTY_MINUTES,
    retry: 1,
  });
};

/**
 * Hook to fetch FastAPI /livez liveness status
 */
export const useFastAPILive = (options?: { enabled?: boolean; refetchInterval?: number | false }) => {
  return useQuery({
    queryKey: queryKeys.health.fastApi.live(),
    queryFn: getFastAPILive,
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval ?? THIRTY_MINUTES,
    staleTime: THIRTY_MINUTES,
    retry: 1,
  });
};

/**
 * Combined hook to fetch all FastAPI health endpoints at once
 * Useful for dashboard views that need all health data
 */
export const useAllHealthStatus = (options?: { enabled?: boolean; refetchInterval?: number | false }) => {
  const fastApiHealth = useFastAPIHealth(options);
  const fastApiReady = useFastAPIReady(options);
  const fastApiLive = useFastAPILive(options);

  const isLoading = 
    fastApiHealth.isLoading || 
    fastApiReady.isLoading || 
    fastApiLive.isLoading;

  const isError = 
    fastApiHealth.isError || 
    fastApiReady.isError || 
    fastApiLive.isError;

  const error = 
    fastApiHealth.error || 
    fastApiReady.error || 
    fastApiLive.error;

  const refetchAll = () => {
    fastApiHealth.refetch();
    fastApiReady.refetch();
    fastApiLive.refetch();
  };

  return {
    fastApiHealth: fastApiHealth.data,
    fastApiReady: fastApiReady.data,
    fastApiLive: fastApiLive.data,
    isLoading,
    isError,
    error,
    refetchAll,
  };
};

/**
 * Type exports for consumers
 */
export type {
  FastAPIHealthResponse,
  FastAPIReadyResponse,
  FastAPILiveResponse,
};
