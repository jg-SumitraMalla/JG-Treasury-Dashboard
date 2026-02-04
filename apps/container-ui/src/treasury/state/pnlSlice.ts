import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchPnlData,
  fetchPnlDataByDate,
  AssetPnlSummary1,
  AssetPnlSummary2,
  PnlData,
} from '../services/pnlService';

type GridState = {
  table1: AssetPnlSummary1[];
  table2: AssetPnlSummary2[];
  loading: boolean;
  error: string | null;
};

type RawState = {
  rows: PnlData[];
  loading: boolean;
  error: string | null;
};

type PnlState = {
  grid: GridState;
  raw: RawState;
};

const initialState: PnlState = {
  grid: {
    table1: [],
    table2: [],
    loading: false,
    error: null,
  },
  raw: {
    rows: [],
    loading: false,
    error: null,
  },
};

export const fetchPnlGridByDateThunk = createAsyncThunk(
  'pnl/fetchGridByDate',
  async (selectedDate: string) => {
    return fetchPnlDataByDate(selectedDate);
  }
);

export const fetchPnlRawDataThunk = createAsyncThunk(
  'pnl/fetchRawData',
  async (params: { startDate: string; endDate: string; year: string }) => {
    const { startDate, endDate, year } = params;
    return fetchPnlData(startDate, endDate, year);
  }
);

const pnlSlice = createSlice({
  name: 'pnl',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPnlGridByDateThunk.pending, (state) => {
        state.grid.loading = true;
        state.grid.error = null;
      })
      .addCase(fetchPnlGridByDateThunk.fulfilled, (state, action) => {
        state.grid.loading = false;
        state.grid.table1 = action.payload?.table_1 ?? [];
        state.grid.table2 = action.payload?.table_2 ?? [];
      })
      .addCase(fetchPnlGridByDateThunk.rejected, (state, action) => {
        state.grid.loading = false;
        state.grid.error = action.error?.message || 'Failed to load grid data';
        state.grid.table1 = [];
        state.grid.table2 = [];
      })
      .addCase(fetchPnlRawDataThunk.pending, (state) => {
        state.raw.loading = true;
        state.raw.error = null;
      })
      .addCase(fetchPnlRawDataThunk.fulfilled, (state, action) => {
        state.raw.loading = false;
        state.raw.rows = action.payload ?? [];
      })
      .addCase(fetchPnlRawDataThunk.rejected, (state, action) => {
        state.raw.loading = false;
        state.raw.error = action.error?.message || 'Failed to load raw data';
        state.raw.rows = [];
      });
  },
});

export default pnlSlice.reducer;
