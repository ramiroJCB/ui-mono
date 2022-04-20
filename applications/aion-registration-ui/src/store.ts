import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootActions } from './combineActions';
import { rootReducer, RootState } from './combineReducers';

const shouldShowDevTools = ['localhost:3000', 'dev.pecdata.net'].includes(window.location.host);

export const store = createStore(
  rootReducer,
  shouldShowDevTools
    ? composeWithDevTools(applyMiddleware(thunkMiddleware as ThunkMiddleware<RootState, RootActions>))
    : applyMiddleware(thunkMiddleware as ThunkMiddleware<RootState, RootActions>)
);
