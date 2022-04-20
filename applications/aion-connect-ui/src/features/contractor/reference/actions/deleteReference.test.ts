import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteReference,
  deleteReferenceFailure,
  deleteReferenceRequest,
  deleteReferenceSuccess
} from './deleteReference';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, references } = fixtures;
const organization = organizations[2];
const reference = references[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ reference: { ...initialState, reference } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete reference', () => {
  it('dipatches only a request action when deleting a reference', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).reply(200);
    await store.dispatch(deleteReference(organization.id, reference.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteReferenceRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/references(${reference.id})`).networkError();
      await store.dispatch(deleteReference(organization.id, reference.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteReferenceRequest());
      expect(actions[1]).toEqual(deleteReferenceFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteReferenceSuccess(reference.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteReferenceSuccess(reference.id));
  });
});
