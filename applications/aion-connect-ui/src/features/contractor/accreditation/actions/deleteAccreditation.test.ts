import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteAccreditation,
  deleteAccreditationFailure,
  deleteAccreditationRequest,
  deleteAccreditationSuccess
} from './deleteAccreditation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, accreditations } = fixtures;
const organization = organizations[2];
const accreditation = accreditations[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ accreditation: { ...initialState, accreditation } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete accreditation', () => {
  it('dipatches only a request action when deleting a accreditation', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/accreditations(${accreditation.id})`).reply(200);
    await store.dispatch(deleteAccreditation(organization.id, accreditation.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteAccreditationRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onDelete(`/api/v3.01/organizations(${organization.id})/accreditations(${accreditation.id})`)
        .networkError();
      await store.dispatch(deleteAccreditation(organization.id, accreditation.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteAccreditationRequest());
      expect(actions[1]).toEqual(deleteAccreditationFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteAccreditationSuccess(accreditation.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteAccreditationSuccess(accreditation.id));
  });
});
