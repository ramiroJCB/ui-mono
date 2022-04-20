import * as fixtures from '../../../../../fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteLicense,
  deleteLicenseFailure,
  deleteLicenseRequest,
  deleteLicenseSuccess
} from './deleteLicense';
import { initialState } from '../reducer';
import { RootState } from 'combineReducers';

const { organizations, licenses } = fixtures;
const organization = organizations[2];
const license = licenses[0];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ license: { ...initialState, license } });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('delete license', () => {
  it('dipatches only a request action when deleting a license', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).reply(200);
    await store.dispatch(deleteLicense(organization.id, license.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteLicenseRequest());
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/licenses(${license.id})`).networkError();
      await store.dispatch(deleteLicense(organization.id, license.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deleteLicenseRequest());
      expect(actions[1]).toEqual(deleteLicenseFailure(error));
    }
  });

  it('dispatches a success action', () => {
    store.dispatch(deleteLicenseSuccess(license.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteLicenseSuccess(license.id));
  });
});
