/**
 * TypeScript interfaces for APAC Real-time Manager API
 *
 * This file contains TypeScript type definitions for API request and response models.
 * Generated for S3 CSV processing task endpoint.
 */

/**
 * Error response model.
 * Returned when an API request fails.
 */
export interface ErrorResponse {
  /** Error message describing what went wrong */
  detail: string;
}
/**
 * Response model for cancelling a task.
 * Returned when calling DELETE /task/{task_id}
 */
// ============================================
// Health Check Types
// ============================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export type ReadyStatus = 'ready' | 'not_ready';
export type LiveStatus = 'alive';

/**
 * FastAPI /healthz comprehensive health check response
 */
export interface FastAPIHealthResponse {
  status: HealthStatus;
  components: {
    api: string;
    database: string;
    security_cache: string;
    celery: string;
  };
}

/**
 * FastAPI /readyz readiness check response
 */
export interface FastAPIReadyResponse {
  status: ReadyStatus;
  database: string;
}

/**
 * FastAPI /livez liveness check response
 */
export interface FastAPILiveResponse {
  status: LiveStatus;
}
