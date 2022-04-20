import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, addReference, addReferenceFailure, addReferenceRequest, addReferenceSuccess } from './addReference';
import { initialState } from '../reducer';
import { IReference } from 'interfaces/reference';
import { IReferenceForm } from 'interfaces/referenceForm';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: IReferenceForm = {
  name: 'Fox Mulder',
  phoneNumber: '9856965555',
  notes:
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
};

const response: IReference = {
  ...values,
  id: 'c3414daf-4877-4a60-9961-7c86c2fd8bdf',
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ reference: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add reference', () => {
  it('dipatches a success action with the newly created reference', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/references`).reply(200, response);
    await store.dispatch(addReference(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addReferenceRequest());
    expect(actions[1]).toEqual(addReferenceSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/reference`).networkError();
      await store.dispatch(addReference(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addReferenceRequest());
      expect(actions[1]).toEqual(addReferenceFailure(error));
    }
  });
});
