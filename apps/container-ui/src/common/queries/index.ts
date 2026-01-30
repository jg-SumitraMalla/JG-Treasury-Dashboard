// Common queries barrel export
export { queryClient, queryKeys } from './queryClient';
export {
  useFastAPIHealth,
  useFastAPIReady,
  useFastAPILive,
  useAllHealthStatus,
} from './useHealth';

// Re-export types
export type {
  FastAPIHealthResponse,
  FastAPIReadyResponse,
  FastAPILiveResponse,
} from './useHealth';

