import configureStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, setViewAsClient, toggleViewAsClient } from './actions';
import { initialState } from './reducer';
import { RootState } from 'combineReducers';

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const store = mockStore({ profile: initialState });

beforeEach(() => {
  store.clearActions();
});

describe('profile', () => {
  it('dispatches the toggle action', () => {
    store.dispatch(toggleViewAsClient());

    const actions = store.getActions();

    expect(actions[0]).toEqual(toggleViewAsClient());
  });

  it('dispatches the set action', () => {
    store.dispatch(setViewAsClient());

    const actions = store.getActions();

    expect(actions[0]).toEqual(setViewAsClient());
  });
});
