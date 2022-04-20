import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addOfficeLocation,
  addOfficeLocationFailure,
  addOfficeLocationRequest,
  addOfficeLocationSuccess
} from './addOfficeLocation';
import { initialState } from '../reducer';
import { IOfficeLocation, OfficeLocationType } from 'interfaces/officeLocation';
import { IOfficeLocationForm } from 'interfaces/officeLocationForm';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: IOfficeLocationForm = {
  type: OfficeLocationType.AdditionalOffice,
  name: 'Main Office',
  streetAddress: '123 Industrial Dr',
  city: 'Mandeville',
  state: { value: 'LA', label: 'Louisiana' },
  postalCode: '70470'
};

const response: IOfficeLocation = {
  ...values,
  id: 'b3b36813-4b81-46a0-a449-b7dee29755f5',
  state: values.state!.value,
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ officeLocation: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add office location', () => {
  it('dipatches a success action with the newly created office location', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/officeLocations`).reply(200, response);
    await store.dispatch(addOfficeLocation(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addOfficeLocationRequest());
    expect(actions[1]).toEqual(addOfficeLocationSuccess(response));
  });

  it('dispatches a failure action due not getting a state value', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);

      await store.dispatch(addOfficeLocation(organization.id, { ...values, state: undefined }));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addOfficeLocationRequest());
      expect(actions[1]).toEqual(addOfficeLocationFailure(error));
    }
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/officeLocation`).networkError();
      await store.dispatch(addOfficeLocation(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addOfficeLocationRequest());
      expect(actions[1]).toEqual(addOfficeLocationFailure(error));
    }
  });
});
