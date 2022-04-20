import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  editOfficeLocation,
  editOfficeLocationFailure,
  editOfficeLocationRequest,
  editOfficeLocationSuccess
} from './editOfficeLocation';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, officeLocations } = fixtures;
const organization = organizations[2];
const officeLocation = officeLocations[0];
const values = { ...officeLocation, name: 'Secondary Office' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ officeLocation: { ...initialState, officeLocation } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit office location', () => {
  it('dipatches a success action with the edited office location', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`)
      .reply(200, values);
    await store.dispatch(
      editOfficeLocation(organization.id, { ...values, state: { value: 'LA', label: 'Louisiana ' } })
    );

    const actions = store.getActions();

    expect(actions[0]).toEqual(editOfficeLocationRequest());
    expect(actions[1]).toEqual(editOfficeLocationSuccess(values));
  });

  it('dispatches a failure action due not getting a state value', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);

      await store.dispatch(editOfficeLocation(organization.id, { ...values, state: undefined }));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editOfficeLocationRequest());
      expect(actions[1]).toEqual(editOfficeLocationFailure(error));
    }
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock
        .onPut(`/api/v3.01/organizations(${organization.id})/officeLocations(${officeLocation.id})`)
        .networkError();
      await store.dispatch(
        editOfficeLocation(organization.id, { ...values, state: { value: 'LA', label: 'Louisiana ' } })
      );
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editOfficeLocationRequest());
      expect(actions[1]).toEqual(editOfficeLocationFailure(error));
    }
  });
});
