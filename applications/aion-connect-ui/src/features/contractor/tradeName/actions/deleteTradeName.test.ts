import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteTradeName,
  deleteTradeNameFailure,
  deleteTradeNameRequest,
  deleteTradeNameSuccess
} from './deleteTradeName';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, tradeNames } = fixtures;
const organization = organizations[2];
const tradeName = tradeNames[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ tradeName: { ...initialState, tradeName } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete trade name', () => {
  it('dipatches only a request action when deleting a trade name', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).reply(200);
    await store.dispatch(deleteTradeName(organization.id, tradeName.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteTradeNameRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).networkError();
      await store.dispatch(deleteTradeName(organization.id, tradeName.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteTradeNameRequest());
      expect(actions[1]).toEqual(deleteTradeNameFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteTradeNameSuccess(tradeName.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteTradeNameSuccess(tradeName.id));
  });
});
