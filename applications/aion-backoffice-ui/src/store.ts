import rootReducer, { RootState } from './combineReducers';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootActions } from './combineActions';

const shouldShowDevTools = ['localhost:3000', 'dev.pecdata.net'].includes(window.location.host);

export default createStore(
  rootReducer,
  shouldShowDevTools
    ? composeWithDevTools(applyMiddleware(thunkMiddleware as ThunkMiddleware<RootState, RootActions>))
    : applyMiddleware(thunkMiddleware as ThunkMiddleware<RootState, RootActions>)
);
