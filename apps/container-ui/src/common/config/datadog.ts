/**
 * Datadog Real User Monitoring (RUM) Configuration
 * 
 * This module initializes Datadog RUM for monitoring user sessions,
 * performance, errors, and custom events across the application.
 * 
 * Features tracked:
 * - Page views and navigation
 * - User sessions and session replays
 * - Performance metrics (Core Web Vitals)
 * - JavaScript errors
 * - API call performance
 * - Custom user actions and events
 */

import { datadogRum } from '@datadog/browser-rum';
import { currentEnvironment, type Environment } from './environment';
import packageJson from '../../../../../package.json';

// Datadog configuration per environment
interface DatadogConfig {
  applicationId: string;
  clientToken: string;
  site: string;
  service: string;
  env: string;
  sessionSampleRate: number;
  sessionReplaySampleRate: number;
  enabled: boolean;
}

const datadogConfigs: Record<Environment, DatadogConfig> = {
  local: {
    applicationId: '0cb26c52-8470-4bbc-be79-e33b274d99d1',
    clientToken: 'pube7db934f5caba20c0b7d560ffbea3379',
    site: 'us5.datadoghq.com',
    service: 'apac-central-dashboard-local',
    env: 'local',
    sessionSampleRate: 50, // Track all sessions in local for debugging
    sessionReplaySampleRate: 50, // Enable replays for heatmaps in local
    enabled: true, // Enable for local testing (set to false to disable)
  },
  development: {
    applicationId: 'eabc3b0a-c080-4413-ade8-37894eb12c64',
    clientToken: 'pub7d8010c6aafc0c5cfd95d2dd6611def3',
    site: 'us5.datadoghq.com',
    service: 'apac-central-dashboard-development',
    env: 'development',
    sessionSampleRate: 100, // Track all sessions in dev
    sessionReplaySampleRate: 100, // 50% replay in dev for debugging
    enabled: true,
  },
  production: {
    applicationId: 'ada9c8c2-5822-4a27-9d09-9c6557b5506e',
    clientToken: 'pubafb045cb2ac8a03944033138bf9d6bf8',
    site: 'us5.datadoghq.com',
    service: 'apac-central-dashboard-production',
    env: 'production',
    sessionSampleRate: 100, // Track all sessions in production
    sessionReplaySampleRate: 100, // 20% replay in production
    enabled: true,
  },
};

// Get current Datadog config
export const datadogConfig = datadogConfigs[currentEnvironment];

// Track if Datadog has been initialized
let isInitialized = false;

/**
 * Initialize Datadog RUM
 * Should be called once at application startup (in main.tsx)
 */
export const initDatadog = (): void => {
  if (isInitialized) {
    console.warn('[Datadog] Already initialized');
    return;
  }

  if (!datadogConfig.enabled) {
    console.log(`[Datadog] Disabled in ${currentEnvironment} environment`);
    return;
  }

  console.log('[Datadog] Starting initialization...');
  console.log('[Datadog] Config:', {
    applicationId: datadogConfig.applicationId,
    clientToken: datadogConfig.clientToken?.substring(0, 10) + '...',
    site: datadogConfig.site,
    service: datadogConfig.service,
    env: datadogConfig.env,
  });

  try {
    const privacyLevel = currentEnvironment === 'production' ? 'mask-user-input' : 'allow';
    
    datadogRum.init({
      applicationId: datadogConfig.applicationId,
      clientToken: datadogConfig.clientToken,
      site: datadogConfig.site,
      service: datadogConfig.service,
      env: datadogConfig.env,
      version: packageJson.version,
      sessionSampleRate: datadogConfig.sessionSampleRate,
      sessionReplaySampleRate: datadogConfig.sessionReplaySampleRate,
      defaultPrivacyLevel: privacyLevel,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      // Tracing for API calls
      allowedTracingUrls: [
        /https:\/\/.*\.jainglobal\.net/,
        /http:\/\/localhost/,
      ],
    });

    isInitialized = true;
    console.log(`[Datadog] ✅ RUM initialized for ${currentEnvironment}`);
    
    // Get session context
    const ctx = datadogRum.getInternalContext();
    console.log('[Datadog] Session ID:', ctx?.session_id);
    
    // Start session replay recording explicitly
    if (datadogConfig.sessionReplaySampleRate > 0) {
      datadogRum.startSessionReplayRecording();
      console.log(`[Datadog] ✅ Session Replay started (sample rate: ${datadogConfig.sessionReplaySampleRate}%)`);
      
      // Get the replay link after a short delay to ensure it's ready
      setTimeout(() => {
        try {
          const replayLink = datadogRum.getSessionReplayLink();
          if (replayLink) {
            console.log('[Datadog] 🎬 Session Replay Link:', replayLink);
          } else {
            console.warn('[Datadog] ⚠️ Session Replay Link not available yet');
          }
        } catch {
          console.warn('[Datadog] ⚠️ Could not get session replay link');
        }
      }, 2000);
    }
  } catch (error) {
    console.error('[Datadog] ❌ Failed to initialize:', error);
  }
};

/**
 * Set user identity for tracking
 * Call this after user authentication
 */
export const setDatadogUser = (user: {
  id: string;
  name: string;
  email: string;
  role?: string;
}): void => {
  if (!datadogConfig.enabled || !isInitialized) return;

  try {
    datadogRum.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    console.log('[Datadog] User set:', user.email);
  } catch (error) {
    console.error('[Datadog] Failed to set user:', error);
  }
};

/**
 * Clear user identity on logout
 */
export const clearDatadogUser = (): void => {
  if (!datadogConfig.enabled || !isInitialized) return;

  try {
    datadogRum.clearUser();
    console.log('[Datadog] User cleared');
  } catch (error) {
    console.error('[Datadog] Failed to clear user:', error);
  }
};

/**
 * Track custom action/event
 * Use for tracking business-specific user actions
 */
export const trackAction = (
  name: string,
  context?: Record<string, unknown>
): void => {
  if (!datadogConfig.enabled || !isInitialized) return;

  try {
    datadogRum.addAction(name, context);
  } catch (error) {
    console.error('[Datadog] Failed to track action:', error);
  }
};

/**
 * Track custom error
 */
export const trackError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  if (!datadogConfig.enabled || !isInitialized) return;

  try {
    datadogRum.addError(error, context);
  } catch (error) {
    console.error('[Datadog] Failed to track error:', error);
  }
};

/**
 * Add global context that will be attached to all events
 */
export const setGlobalContext = (
  key: string,
  value: unknown
): void => {
  if (!datadogConfig.enabled || !isInitialized) return;

  try {
    datadogRum.setGlobalContextProperty(key, value);
  } catch (error) {
    console.error('[Datadog] Failed to set global context:', error);
  }
};

// Pre-defined action names for consistency
export const DatadogActions = {
  // Authentication
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',

  // Navigation
  TAB_SWITCH: 'tab_switch',
  PAGE_VIEW: 'page_view',

  // Search & Query
  SEARCH_EXECUTED: 'search_executed',
  QUERY_BY_DATE: 'query_by_date',
  BULK_QUERY: 'bulk_query',
  PM_RATES_QUERY: 'pm_rates_query',

  // Data Export
  CSV_EXPORT: 'csv_export',
  XLSX_EXPORT: 'xlsx_export',

  // File Operations
  FILE_VIEW: 'file_view',
  FILE_DOWNLOAD: 'file_download',

  // Task Management
  TASK_TRIGGER: 'task_trigger',
  TASK_CANCEL: 'task_cancel',
  TASK_DELETE: 'task_delete',

  // Filters
  BROKER_FILTER_APPLIED: 'broker_filter_applied',
  DATE_FILTER_APPLIED: 'date_filter_applied',
} as const;

export type DatadogActionName = typeof DatadogActions[keyof typeof DatadogActions];

