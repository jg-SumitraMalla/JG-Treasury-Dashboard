import { configureStore } from '@reduxjs/toolkit';
import pnlReducer from '../treasury/state/pnlSlice';

export const store = configureStore({
  reducer: {
    pnl: pnlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
