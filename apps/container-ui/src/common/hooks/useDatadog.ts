/**
 * useDatadog Hook
 * 
 * Custom hook for tracking user actions and events with Datadog RUM.
 * Provides convenient methods for tracking common application events.
 */

import { useCallback } from 'react';
import { 
  trackAction, 
  trackError, 
  DatadogActions,
  type DatadogActionName,
} from '../config/datadog';

interface TrackSearchParams {
  searchType: 'ticker' | 'isin' | 'sedol';
  searchValue: string;
  resultsCount?: number;
}

interface TrackQueryParams {
  date: string;
  tickersCount?: number;
  resultsCount?: number;
  brokersCount?: number;
}

interface TrackExportParams {
  format: 'csv' | 'xlsx';
  rowCount: number;
  source: string;
}

interface TrackTabSwitchParams {
  fromTab?: string;
  toTab: string;
  dashboard: string;
}

export const useDatadog = () => {
  /**
   * Track generic action
   */
  const track = useCallback((
    action: DatadogActionName | string,
    context?: Record<string, unknown>
  ) => {
    trackAction(action, context);
  }, []);

  /**
   * Track search execution
   */
  const trackSearch = useCallback((params: TrackSearchParams) => {
    trackAction(DatadogActions.SEARCH_EXECUTED, {
      search_type: params.searchType,
      search_value: params.searchValue,
      results_count: params.resultsCount,
    });
  }, []);

  /**
   * Track query by date
   */
  const trackQueryByDate = useCallback((params: TrackQueryParams) => {
    trackAction(DatadogActions.QUERY_BY_DATE, {
      date: params.date,
      tickers_count: params.tickersCount,
      results_count: params.resultsCount,
      brokers_count: params.brokersCount,
    });
  }, []);

  /**
   * Track bulk query
   */
  const trackBulkQuery = useCallback((params: TrackQueryParams) => {
    trackAction(DatadogActions.BULK_QUERY, {
      date: params.date,
      tickers_count: params.tickersCount,
      results_count: params.resultsCount,
      brokers_count: params.brokersCount,
    });
  }, []);

  /**
   * Track Bulk Rates query
   */
  const trackPMRatesQuery = useCallback((params: TrackQueryParams) => {
    trackAction(DatadogActions.PM_RATES_QUERY, {
      date: params.date,
      tickers_count: params.tickersCount,
      results_count: params.resultsCount,
      markets_matched: params.brokersCount,
    });
  }, []);

  /**
   * Track data export
   */
  const trackExport = useCallback((params: TrackExportParams) => {
    const action = params.format === 'xlsx' 
      ? DatadogActions.XLSX_EXPORT 
      : DatadogActions.CSV_EXPORT;
    trackAction(action, {
      format: params.format,
      row_count: params.rowCount,
      source: params.source,
    });
  }, []);

  /**
   * Track tab switch
   */
  const trackTabSwitch = useCallback((params: TrackTabSwitchParams) => {
    trackAction(DatadogActions.TAB_SWITCH, {
      from_tab: params.fromTab,
      to_tab: params.toTab,
      dashboard: params.dashboard,
    });
  }, []);

  /**
   * Track file view
   */
  const trackFileView = useCallback((fileName: string, rowCount?: number) => {
    trackAction(DatadogActions.FILE_VIEW, {
      file_name: fileName,
      row_count: rowCount,
    });
  }, []);

  /**
   * Track task trigger
   */
  const trackTaskTrigger = useCallback((taskType: string, params?: Record<string, unknown>) => {
    trackAction(DatadogActions.TASK_TRIGGER, {
      task_type: taskType,
      ...params,
    });
  }, []);

  /**
   * Track task cancel
   */
  const trackTaskCancel = useCallback((taskId: string) => {
    trackAction(DatadogActions.TASK_CANCEL, {
      task_id: taskId,
    });
  }, []);

  /**
   * Track broker filter
   */
  const trackBrokerFilter = useCallback((brokers: string[], source: string) => {
    trackAction(DatadogActions.BROKER_FILTER_APPLIED, {
      brokers_selected: brokers,
      brokers_count: brokers.length,
      source,
    });
  }, []);

  /**
   * Track error
   */
  const trackErrorEvent = useCallback((error: Error, context?: Record<string, unknown>) => {
    trackError(error, context);
  }, []);

  return {
    track,
    trackSearch,
    trackQueryByDate,
    trackBulkQuery,
    trackPMRatesQuery,
    trackExport,
    trackTabSwitch,
    trackFileView,
    trackTaskTrigger,
    trackTaskCancel,
    trackBrokerFilter,
    trackError: trackErrorEvent,
    DatadogActions,
  };
};

export default useDatadog;

