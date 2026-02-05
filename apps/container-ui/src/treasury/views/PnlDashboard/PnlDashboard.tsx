import React, { useEffect, useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, ColDef } from 'ag-grid-community';
import { Spin, Alert, Space, DatePicker, Tag, Switch, Button } from 'antd';
import dayjs from 'dayjs';
import { useTheme, BodyText } from '@apac-ui-warehouse/component-warehouse';
  import { fetchPnlData } from '../../services/pnlService';
import { fetchPnlGridByDateThunk } from '../../state/pnlSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  formatLocalDate,
  toCompactDate,
  prettifyHeader,
  normalizeRawDate,
  isNumericValue,
  formatRounded,
  formatNumber,
} from './pnlUtils';
import './PnlDashboard.css';

// (No manual module registration required for this app setup)

export const PnlDashboard: React.FC = () => {
  const { theme } = useTheme();

  const getTMinus = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return formatLocalDate(d);
  };

  // default to T-2 date
  const [selectedDate, setSelectedDate] = useState<string>(() => getTMinus(2));

  const [viewMode, setViewMode] = useState<'MTD' | 'YTD'>('MTD');
  const [unitMode, setUnitMode] = useState<'$' | 'bps'>('$');
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const { table1, table2, loading, error } = useAppSelector((state) => state.pnl.grid);
  const [rawDetailOpen, setRawDetailOpen] = useState(false);
  const [rawDetailLoading, setRawDetailLoading] = useState(false);
  const [rawDetailError, setRawDetailError] = useState<string | null>(null);
  const [rawDetailValues, setRawDetailValues] = useState<{
    cashAtCustodian: any;
    mmf: any;
  } | null>(null);
  const [rawDetailAnchor, setRawDetailAnchor] = useState<HTMLElement | null>(null);

  const gridApi1 = useRef<any>(null);
  const gridApi2 = useRef<any>(null);
  const dispatch = useAppDispatch();

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

    const getHeaderInfo = (key: string) => {
      const header = headerMap[key] ?? prettifyHeader(key);
      const headerLower = header.toLowerCase();
      return {
        header,
        hasBps: headerLower.includes('bps'),
        hasDollar: header.includes('$'),
        isMtd: key.startsWith('MTD_'),
        isYtd: key.startsWith('YTD_'),
      };
    };

    const matchesViewMode = (info: ReturnType<typeof getHeaderInfo>) => {
      if (info.isMtd) return viewMode === 'MTD';
      if (info.isYtd) return viewMode === 'YTD';
      return true;
    };

    const matchesUnitMode = (info: ReturnType<typeof getHeaderInfo>) => {
      if (!info.hasBps && !info.hasDollar) return true;
      return unitMode === '$' ? info.hasDollar : info.hasBps;
    };

    const shouldIncludeKey = (key: string) => {
      if (!filtersEnabled) return true;
      const info = getHeaderInfo(key);
      return matchesViewMode(info) && matchesUnitMode(info);
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

  const filteredTable1 = useMemo(
    () => table1.filter((row) => (row as any)?.Asset != 'Total'),
    [table1]
  );
  const colDefs1 = useMemo<ColDef[]>(() => createColDefs(filteredTable1), [filteredTable1, viewMode, unitMode, filtersEnabled]);
  const colDefs2 = useMemo<ColDef[]>(() => createColDefs(table2), [table2, viewMode, unitMode, filtersEnabled]);

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


  useEffect(() => {
    const compact = toCompactDate(selectedDate);
    dispatch(fetchPnlGridByDateThunk(compact));
  }, [dispatch, selectedDate, toCompactDate]);

  useEffect(() => {
    return () => {
      setRawDetailOpen(false);
      setRawDetailAnchor(null);
    };
  }, []);

  // Auto-size columns based on header + cell content
  useEffect(() => {
    const autoSize = (api: any) => {
      if (!api?.getAllDisplayedColumns || api?.isDestroyed?.()) return;
      const displayedCols = api.getAllDisplayedColumns();
      const colIds = displayedCols.map((c: any) => c.getColId());
      if (colIds.length === 0) return;

      api.autoSizeColumns(colIds, false);
    };
    const sizeToFit = (api: any) => {
      if (!api?.sizeColumnsToFit || api?.isDestroyed?.()) return;
      api.sizeColumnsToFit();
    };
    const timer = setTimeout(() => {
      if (filtersEnabled) {
        sizeToFit(gridApi1.current);
        // sizeToFit(gridApi2.current);
      } else {
        autoSize(gridApi1.current);
        // autoSize(gridApi2.current);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [table1, table2, colDefs1, colDefs2, viewMode, unitMode, filtersEnabled]);

  const handleCurrentNtlClick = async (params: any) => {
    const colId = params?.column?.getColId?.();
    const asset = params?.data?.Asset;
    if (colId !== 'Current_Ntl' || asset !== 'Cash at Custodian & MMF') return;
    if (!selectedDate) return;

    setRawDetailOpen(true);
    setRawDetailAnchor(params?.event?.target as HTMLElement | null);
    setRawDetailLoading(true);
    setRawDetailError(null);
    setRawDetailValues(null);
    try {
      const compact = toCompactDate(selectedDate);
      const year = selectedDate.slice(0, 4);
      const data = await fetchPnlData(compact, compact, year);
      const match = data.find((row) => normalizeRawDate((row as any)?.date) === selectedDate);
      if (!match) {
        setRawDetailError('No raw data found for the selected date.');
      } else {
        setRawDetailValues({
          cashAtCustodian: (match as any)?.Cash_at_Custodian_Ntl,
          mmf: (match as any)?.MMF_Ntl,
        });
      }
    } catch (err: any) {
      setRawDetailError(err?.message || String(err));
    } finally {
      setRawDetailLoading(false);
    }
  };

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
          onChange={(checked) => {
            setViewMode(checked ? 'YTD' : 'MTD');
            setFiltersEnabled(true);
          }}
          checkedChildren="YTD"
          unCheckedChildren="MTD"
        />
        <Switch
          className="pnlDashboardToggle"
          checked={unitMode === 'bps'}
          onChange={(checked) => {
            setUnitMode(checked ? 'bps' : '$');
            setFiltersEnabled(true);
          }}
          checkedChildren="bps"
          unCheckedChildren="$"
        />
        <Button
          type="primary"
          onClick={() => {
            setFiltersEnabled(false);
            setViewMode('MTD');
            setUnitMode('$');
          }}
        >
          Reset
        </Button>
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
              rowData={filteredTable1 as any}
              columnDefs={colDefs1}
              defaultColDef={defaultColDef}
              onCellClicked={handleCurrentNtlClick}
              onGridReady={(params: GridReadyEvent) => {
                gridApi1.current = params.api;
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
              }}
            />
          </div>
        </>
      )}
      {rawDetailOpen && rawDetailAnchor && (
        <div
          className="pnlDashboardTooltip"
          style={{
            position: 'fixed',
            zIndex: 1000,
            left: rawDetailAnchor.getBoundingClientRect().left,
            top: rawDetailAnchor.getBoundingClientRect().bottom + 6,
          }}
        >
          <div className="pnlDashboardTooltipContent">
            <div className="pnlDashboardTooltipTitle">
              Cash at Custodian and MMF - {selectedDate}
            </div>
            {rawDetailLoading && <BodyText>Loading...</BodyText>}
            {rawDetailError && (
              <Alert message="Error" description={rawDetailError} type="error" showIcon />
            )}
            {!rawDetailLoading && !rawDetailError && rawDetailValues && (
              <Space direction="vertical" size="small">
                <BodyText>
                  <strong>Cash at Custodian Ntl:</strong>{' '}
                  {formatNumber(rawDetailValues.cashAtCustodian) || '-'}
                </BodyText>
                <BodyText>
                  <strong>MMF Ntl:</strong> {formatNumber(rawDetailValues.mmf) || '-'}
                </BodyText>
              </Space>
            )}
            <div className="pnlDashboardTooltipActions">
              <Button type="primary" size="small" onClick={() => setRawDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnlDashboard;