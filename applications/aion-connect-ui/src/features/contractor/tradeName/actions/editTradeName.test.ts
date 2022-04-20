import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editTradeName,
  editTradeNameFailure,
  editTradeNameRequest,
  editTradeNameSuccess
} from './editTradeName';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, tradeNames } = fixtures;
const organization = organizations[2];
const tradeName = tradeNames[0];
const values = { ...tradeName, name: 'Initech Technology' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ tradeName: { ...initialState, tradeName } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit trade name', () => {
  it('dipatches a success action with the edited trade name', async () => {
    axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).reply(200, values);
    await store.dispatch(editTradeName(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editTradeNameRequest());
    expect(actions[1]).toEqual(editTradeNameSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).networkError();
      await store.dispatch(editTradeName(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editTradeNameRequest());
      expect(actions[1]).toEqual(editTradeNameFailure(error));
    }
  });
});
