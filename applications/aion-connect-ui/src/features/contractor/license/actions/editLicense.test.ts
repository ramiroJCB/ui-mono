import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, editLicense, editLicenseFailure, editLicenseRequest, editLicenseSuccess } from './editLicense';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, licenses } = fixtures;
const organization = organizations[2];
const license = licenses[0];
const values = { ...license, name: 'Welding' };
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ license: { ...initialState, license } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('edit license', () => {
  it('dipatches a success action with the edited license', async () => {
    axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).reply(200, values);
    await store.dispatch(editLicense(organization.id, values));

    const actions = store.getActions();

    expect(actions[0]).toEqual(editLicenseRequest());
    expect(actions[1]).toEqual(editLicenseSuccess(values));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).networkError();
      await store.dispatch(editLicense(organization.id, values));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(editLicenseRequest());
      expect(actions[1]).toEqual(editLicenseFailure(error));
    }
  });
});
