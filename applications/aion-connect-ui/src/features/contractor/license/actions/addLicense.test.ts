import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, addLicense, addLicenseFailure, addLicenseRequest, addLicenseSuccess } from './addLicense';
import { ILicense } from 'interfaces/license';
import { ILicenseForm } from 'interfaces/licenseForm';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const values: ILicenseForm = {
  name: 'Pipefitting',
  issueDateUtc: '2018-09-15T03:00:00Z',
  licenseId: '385308A83-01'
};

const response: ILicense = {
  ...values,
  id: 'd34acb83-4164-4395-bc86-b01171429eaa',
  organizationId: organization.id,
  isDeleted: false
};

const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ license: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('add license', () => {
  it('dipatches a success action with the newly created license', async () => {
    axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/licenses`).reply(200, response);
    await store.dispatch(addLicense(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addLicenseRequest());
    expect(actions[1]).toEqual(addLicenseSuccess(response));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organization.id})/license`).networkError();
      await store.dispatch(addLicense(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addLicenseRequest());
      expect(actions[1]).toEqual(addLicenseFailure(error));
    }
  });
});
