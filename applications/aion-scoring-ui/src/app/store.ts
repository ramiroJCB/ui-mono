import { Action } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
import { ThunkAction } from 'redux-thunk';

const shouldShowDevTools = ['localhost:3000', 'dev.pecdata.net'].includes(window.location.host);
export const store = configureStore({ reducer, devTools: shouldShowDevTools });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
