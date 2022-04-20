import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteOfficeLocation,
  deleteOfficeLocationFailure,
  deleteOfficeLocationRequest,
  deleteOfficeLocationSuccess
} from './deleteOfficeLocation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, officeLocations } = fixtures;
const organization = organizations[2];
const officeLocation = officeLocations[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ officeLocation: { ...initialState, officeLocation } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete office location', () => {
  it('dipatches only a request action when deleting a office location', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`).reply(200);
    await store.dispatch(deleteOfficeLocation(organization.id, officeLocation.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteOfficeLocationRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onDelete(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`)
        .networkError();
      await store.dispatch(deleteOfficeLocation(organization.id, officeLocation.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteOfficeLocationRequest());
      expect(actions[1]).toEqual(deleteOfficeLocationFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteOfficeLocationSuccess(officeLocation.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteOfficeLocationSuccess(officeLocation.id));
  });
});
