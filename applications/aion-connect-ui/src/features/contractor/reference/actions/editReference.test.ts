import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editReference,
  editReferenceFailure,
  editReferenceRequest,
  editReferenceSuccess
} from './editReference';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, references } = fixtures;
const organization = organizations[2];
const reference = references[0];
const values = { ...reference, name: 'Dana Scully' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ reference: { ...initialState, reference } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit reference', () => {
  it('dipatches a success action with the edited reference', async () => {
    axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).reply(200, values);
    await store.dispatch(editReference(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editReferenceRequest());
    expect(actions[1]).toEqual(editReferenceSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).networkError();
      await store.dispatch(editReference(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editReferenceRequest());
      expect(actions[1]).toEqual(editReferenceFailure(error));
    }
  });
});
