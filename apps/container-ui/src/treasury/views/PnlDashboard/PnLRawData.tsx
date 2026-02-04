import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Alert, Button, DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useTheme, BodyText } from '@apac-ui-warehouse/component-warehouse';
import { fetchPnlRawDataThunk } from '../../state/pnlSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { AgCharts } from 'ag-charts-react';
import type { AgCartesianChartOptions } from 'ag-charts-types';
import {
  toCompactDate,
  prettifyHeader,
  toChartDateLabel,
  isNumericValue,
  formatNumber,
  autoSizeGridColumns,
} from './pnlUtils';
import './PnlDashboard.css';

type YearOption = { label: string; value: string };

const getDefaultRangeForYear = (year: string) => {
  if (year === '2024') {
    return { start: '2024-07-01', end: '2024-12-31' };
  }
  return { start: `${year}-01-01`, end: `${year}-12-31` };
};

export const PnlRawData: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = String(new Date().getFullYear());
  const yearOptions: YearOption[] = useMemo(() => {
    const years: YearOption[] = [];
    for (let y = 2024; y <= Number(currentYear); y += 1) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  }, [currentYear]);

  const [year, setYear] = useState<string>(currentYear);
  const defaultRange = useMemo(() => getDefaultRangeForYear(year), [year]);
  const [startDate, setStartDate] = useState<string>(defaultRange.start);
  const [endDate, setEndDate] = useState<string>(defaultRange.end);
  const { rows, loading, error } = useAppSelector((state) => state.pnl.raw);
  const gridApi = useRef<any>(null);
  const dispatch = useAppDispatch();

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  }), []);

  const colDefs = useMemo<ColDef[]>(() => {
    if (!rows || rows.length === 0) return [];
    const firstRow = rows[0] as any;
    return Object.keys(firstRow).map((key) => {
      const isDateField = key.toLowerCase() === 'date';
      const isNumeric = isNumericValue(firstRow?.[key]);
      return {
        headerName: prettifyHeader(key),
        field: key,
        ...(isDateField
          ? {
              valueFormatter: (params: any) => toChartDateLabel(params.value),
              sort: 'desc' as const,
            }
          : isNumeric
            ? { valueFormatter: (params: any) => formatNumber(params.value) }
            : {}),
      } as ColDef;
    });
  }, [rows]);

  const chartData = useMemo(() => {
    return rows
      .map((row) => ({
        date: toChartDateLabel((row as any)?.date),
        value: (row as any)?.Weighted_Ave_Return_adj,
      }))
      .filter((row) => row.date && row.value !== null && row.value !== undefined);
  }, [rows]);

  const chartOptions = useMemo<AgCartesianChartOptions>(() => ({
    data: chartData,
    theme: theme === 'dark' ? 'ag-default-dark' : 'ag-default',
    autoSize: true,
    series: [
      {
        type: 'line' as const,
        xKey: 'date',
        yKey: 'value',
        yName: 'Weighted Ave Return Adj',
        marker: { enabled: true, size: 4 },
        strokeWidth: 2,
      },
    ],
    axes: [
      { type: 'category' as const, position: 'bottom' as const },
      { type: 'number' as const, position: 'left' as const, interval: { minSpacing: 20 } },
    ],
    legend: { enabled: true, position: 'bottom' },
  }), [chartData, theme]);

  useEffect(() => {
    const timer = setTimeout(() => autoSizeGridColumns(gridApi.current), 0);
    return () => clearTimeout(timer);
  }, [rows, colDefs]);

  const handleYearChange = (value: string) => {
    setYear(value);
    const range = getDefaultRangeForYear(value);
    setStartDate(range.start);
    setEndDate(range.end);
  };

  const handleSearch = () => {
    const start = toCompactDate(startDate);
    const end = toCompactDate(endDate);
    dispatch(fetchPnlRawDataThunk({ startDate: start, endDate: end, year }));
  };

  return (
    <div
      className={`pnlDashboard pnlRawData${theme === 'dark' ? ' pnlDashboard--dark' : ''}`}
    >
      <Space direction="horizontal" className="pnlDashboardHeader">
        <BodyText strong>Year</BodyText>
        <Select
          value={year}
          options={yearOptions}
          style={{ width: 120 }}
          onChange={handleYearChange}
        />
        <BodyText strong>Start Date</BodyText>
        <DatePicker
          placeholder="Start Date"
          value={startDate ? dayjs(startDate, 'YYYY-MM-DD') : null}
          onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')}
          format="YYYY-MM-DD"
          allowClear={false}
        />
        <BodyText strong>End Date</BodyText>
        <DatePicker
          placeholder="End Date"
          value={endDate ? dayjs(endDate, 'YYYY-MM-DD') : null}
          onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')}
          format="YYYY-MM-DD"
          allowClear={false}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Space>

      {error && <Alert message="Error" description={error} type="error" showIcon />}
      {loading && <div className="pnlDashboardLoading">Loading...</div>}

      {!loading && (
        <div className="pnlRawDataContent">
          <div className="pnlDashboardChart">
            <AgCharts options={chartOptions} />
          </div>
          <div className={`pnlRawDataGrid ag-theme-quartz${theme === 'dark' ? '-dark' : ''}`}>
            <AgGridReact
              rowData={rows as any}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              onGridReady={(params: GridReadyEvent) => {
                gridApi.current = params.api;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
