import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editAccreditation,
  editAccreditationFailure,
  editAccreditationRequest,
  editAccreditationSuccess
} from './editAccreditation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, accreditations } = fixtures;
const organization = organizations[2];
const accreditation = accreditations[0];
const values = { ...accreditation, name: 'Insular Repair' };

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ accreditation: { ...initialState, accreditation } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit accreditation', () => {
  it('dipatches a success action with the edited accreditation', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organization.id})/accreditations(${accreditation.id})`)
      .reply(200, values);
    await store.dispatch(editAccreditation(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editAccreditationRequest());
    expect(actions[1]).toEqual(editAccreditationSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onPut(`/api/v3.01/organizations(${organization.id})/accreditations(${accreditation.id})`)
        .networkError();
      await store.dispatch(editAccreditation(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editAccreditationRequest());
      expect(actions[1]).toEqual(editAccreditationFailure(error));
    }
  });
});
