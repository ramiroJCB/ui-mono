import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, addTradeName, addTradeNameFailure, addTradeNameRequest, addTradeNameSuccess } from './addTradeName';
import { initialState } from '../reducer';
import { ITradeName } from 'interfaces/tradeName';
import { ITradeNameForm } from 'interfaces/tradeNameForm';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: ITradeNameForm = {
  name: 'Initech Technology Solutions',
  description:
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
};

const response: ITradeName = {
  ...values,
  id: 'c3414daf-4877-4a60-9961-7c86c2fd8bdf',
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ tradeName: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add trade name', () => {
  it('dipatches a success action with the newly created trade name', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/tradeNames`).reply(200, response);
    await store.dispatch(addTradeName(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addTradeNameRequest());
    expect(actions[1]).toEqual(addTradeNameSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/tradeName`).networkError();
      await store.dispatch(addTradeName(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addTradeNameRequest());
      expect(actions[1]).toEqual(addTradeNameFailure(error));
    }
  });
});
