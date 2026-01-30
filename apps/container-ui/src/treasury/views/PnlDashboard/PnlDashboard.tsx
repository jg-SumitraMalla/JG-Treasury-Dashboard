import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, ColDef } from 'ag-grid-community';
import { Spin, Alert, Space, DatePicker, Tag, Switch } from 'antd';
import dayjs from 'dayjs';
import { useTheme, BodyText } from '@apac-ui-warehouse/component-warehouse';
import { fetchPnlDataByDate, AssetPnlSummary1, AssetPnlSummary2 } from '../../services/pnlService';
import './PnlDashboard.css';

// (No manual module registration required for this app setup)

export const PnlDashboard: React.FC = () => {
  const { theme } = useTheme();

  // selectedDate in yyyy-mm-dd format (bound to DatePicker)
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getTMinus = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return formatLocalDate(d);
  };

  // default to T-2 date
  const [selectedDate, setSelectedDate] = useState<string>(() => getTMinus(2));

  const [table1, setTable1] = useState<AssetPnlSummary1[]>([]);
  const [table2, setTable2] = useState<AssetPnlSummary2[]>([]);
  const [viewMode, setViewMode] = useState<'MTD' | 'YTD'>('MTD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gridApi1 = useRef<any>(null);
  const gridApi2 = useRef<any>(null);

  // Shared default column definition
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  }), []);
const headerMap: Record<string, string> = {
  Current_Ntl: 'Current Ntl ($)',
  MTD_PnL: 'MTD PnL ($)',
  YTD_PnL: 'YTD PnL ($)',
  MTD_SOFR_Equiv : 'MTD SOFR Equiv ($)',
  YTD_SOFR_Equiv : 'YTD SOFR Equiv ($)',
  MTD_PnL_SOFR : 'MTD PnL SOFR ($)',
  YTD_PnL_SOFR : 'YTD PnL SOFR ($)',
    MTD_PnL_NAV : 'MTD PnL vs NAV (bps)',
    YTD_PnL_NAV : 'YTD PnL vs NAV (bps)',
    MTD_NAV_SOFR : 'MTD NAV vs SOFR (bps)',
    YTD_NAV_SOFR : 'YTD NAV vs SOFR (bps)',
    MTD_SOFR_Ann : 'MTD vs SOFR Ann. (bps)',
    YTD_SOFR_Ann : 'YTD vs SOFR Ann. (bps)',

  // add other mappings here...
};

  // Helper to format numbers as rounded integers with thousand separators
  const formatRounded = (val: any) => {
    if (val === null || val === undefined || val === '') return '';
    const n = Number(val);
    if (!Number.isFinite(n)) return String(val);
    return Math.round(n).toLocaleString();
  };

  // Detect numeric-like values (numbers or numeric strings). Excludes booleans.
  const isNumericValue = (val: any) => {
    if (val === null || val === undefined || val === '') return false;
    if (typeof val === 'number') return Number.isFinite(val);
    if (typeof val === 'string') {
      const s = val.trim();
      // numeric regexp: integers, decimals, optional exponent
      return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s);
    }
    return false;
  };
    const shouldIncludeKey = (key: string) => {
      if (key.startsWith('MTD_')) return viewMode === 'MTD';
      if (key.startsWith('YTD_')) return viewMode === 'YTD';
      return true;
    };

    // Build column definitions from first row of each table
    const createColDefs = (rows: any[] | undefined) => {
      if (!rows || rows.length === 0) return [] as ColDef[];
      const keys = Object.keys(rows[0] as any).filter(shouldIncludeKey);

      // Ensure `Current_Ntl` is the second column (index 1) if present
      const target = 'Current_Ntl';
      const idx = keys.indexOf(target);
      if (idx !== -1) {
        keys.splice(idx, 1);
        // insert at index 1 (second position). If array is shorter, append.
        const insertAt = Math.min(1, keys.length);
        keys.splice(insertAt, 0, target);
      }

      const firstRow = rows[0] as any;
      return keys.map((k) => {
        const isNumeric = isNumericValue(firstRow?.[k]);
        return {
          headerName: headerMap[k] ?? prettifyHeader(k),
          field: k,
          ...(isNumeric ? { valueFormatter: (params: any) => formatRounded(params.value) } : {}),
        } as ColDef;
      });
    };

  const colDefs1 = useMemo<ColDef[]>(() => createColDefs(table1), [table1, viewMode]);
    const colDefs2 = useMemo<ColDef[]>(() => createColDefs(table2), [table2, viewMode]);

  const table1Totals = useMemo(() => {
    if (!table1 || table1.length === 0 || colDefs1.length === 0)
      return [] as Array<{ key: string; label: string; total: number }>;

    const totalRow = table1.find((row) => (row as any)?.Asset === 'Total');
    if (!totalRow) return [] as Array<{ key: string; label: string; total: number }>;

    const totals: Array<{ key: string; label: string; total: number }> = [];

    colDefs1.forEach((colDef) => {
      const key = String(colDef.field ?? '');
      if (!key) return;
      const val = (totalRow as any)[key];
      if (!isNumericValue(val)) return;
      totals.push({
        key,
        label: (colDef.headerName as string) ?? headerMap[key] ?? prettifyHeader(key),
        total: Number(val),
      });
    });

    return totals;
  }, [table1, colDefs1]);

  // Convert yyyy-mm-dd to yyyymmdd
  const toCompactDate = (isoDate: string) => isoDate.replace(/-/g, '');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const compact = toCompactDate(selectedDate);
        const resp = await fetchPnlDataByDate(compact);
        if (cancelled) return;
        setTable1(resp.table_1 || []);
        setTable2(resp.table_2 || []);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || String(err));
        setTable1([]);
        setTable2([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  // When data changes, try to size columns to fit new width
  useEffect(() => {
    try {
      gridApi1.current?.sizeColumnsToFit?.();
    } catch {}
    try {
      gridApi2.current?.sizeColumnsToFit?.();
    } catch {}
  }, [table1, table2, viewMode]);

  // Temporarily override parent layout container styles so this page uses full content width.
  useEffect(() => {
    // Helper: find elements whose class name contains the given substring (handles CSS modules)
    const findByPartialClass = (part: string) => {
      return Array.from(document.querySelectorAll('[class]')).find((el) =>
        Array.from((el as HTMLElement).classList).some((c) => c.indexOf(part) >= 0)
      ) as HTMLElement | undefined;
    };

    const contentWrapper = findByPartialClass('contentWrapper');
    const content = findByPartialClass('content');

    const prev = {
      contentWrapper: contentWrapper
        ? {
            maxWidth: contentWrapper.style.maxWidth,
            padding: contentWrapper.style.padding,
            margin: contentWrapper.style.margin,
            width: contentWrapper.style.width,
          }
        : null,
      content: content
        ? {
            padding: content.style.padding,
          }
        : null,
    };

    if (contentWrapper) {
      contentWrapper.style.maxWidth = 'none';
      contentWrapper.style.padding = '0';
      contentWrapper.style.margin = '0';
      contentWrapper.style.width = '100%';
    }

    if (content) {
      content.style.padding = '0';
    }

    return () => {
      // restore previous styles on unmount
      if (contentWrapper && prev.contentWrapper) {
        contentWrapper.style.maxWidth = prev.contentWrapper.maxWidth || '';
        contentWrapper.style.padding = prev.contentWrapper.padding || '';
        contentWrapper.style.margin = prev.contentWrapper.margin || '';
        contentWrapper.style.width = prev.contentWrapper.width || '';
      }
      if (content && prev.content) {
        content.style.padding = prev.content.padding || '';
      }
    };
  }, []);

  function prettifyHeader(key: string) {
    // Basic prettify: replace underscores and camelCase boundaries
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    // Local container overrides: remove max-width/padding so this page can use full parent width
    <div
      className={`pnlDashboard${theme === 'dark' ? ' pnlDashboard--dark' : ''}`}
    >
      <Space direction="horizontal" className="pnlDashboardHeader">
        <BodyText strong>Selected date</BodyText>
        <DatePicker
          placeholder="Select Date"
          value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
          onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
          format="YYYY-MM-DD"
          className="pnlDashboardDatePicker"
          allowClear={false}
        />
        <Switch
          className="pnlDashboardToggle"
          checked={viewMode === 'YTD'}
          onChange={(checked) => setViewMode(checked ? 'YTD' : 'MTD')}
          checkedChildren="YTD"
          unCheckedChildren="MTD"
        />
      </Space>

      {error && <Alert message="Error" description={error} type="error" showIcon />}

      {loading ? (
        <div className="pnlDashboardLoading">
          <Spin />
        </div>
      ) : (
        <>
          {table1Totals.length > 0 && (
            <div className="pnlDashboardTotals">
              {table1Totals.map((item) => (
                <Tag
                  key={item.key}
                  color={theme === 'dark' ? 'geekblue' : 'blue'}
                  className="pnlDashboardTotalsTag"
                >
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{formatRounded(item.total)}</span>
                </Tag>
              ))}
            </div>
          )}
          <div
            className={`pnlDashboardGrid ag-theme-quartz${theme === 'dark' ? '-dark' : ''}`}
          >
            <AgGridReact
              rowData={table1 as any}
              columnDefs={colDefs1}
              defaultColDef={defaultColDef}
              onGridReady={(params: GridReadyEvent) => {
                gridApi1.current = params.api;
                try {
                  params.api.sizeColumnsToFit();
                } catch {}
              }}
            />
          </div>

          <div
            className={`pnlDashboardGrid ag-theme-quartz${theme === 'dark' ? '-dark' : ''}`}
          >
            <AgGridReact
              rowData={table2 as any}
              columnDefs={colDefs2}
              defaultColDef={defaultColDef}
              onGridReady={(params: GridReadyEvent) => {
                gridApi2.current = params.api;
                try {
                  params.api.sizeColumnsToFit();
                } catch {}
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PnlDashboard;