import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Actions, fetchLogo, fetchLogoFailure, fetchLogoRequest, fetchLogoSuccess } from './fetchLogo';
import { initialState } from '../reducer';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organization = organizations[2];
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ logo: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('fetch logo', () => {
  const metaData: IUploadedLogo = {
    id: 'd43d747e-274c-4517-a64e-ed30b833e790',
    organizationId: organization.id,
    fileName: 'test.jpg',
    storagePath: 'organization-logo/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
    mimeType: 'image/jpeg',
    isDeleted: false
  };

  const logo = new Blob(['foobar'], { type: 'image/jpg' });

  it('dispatches a success action when fetching the logo', async () => {
    const response = metaData;

    axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).reply(200, response);

    axiosMock
      .onGet(`/files/v3.01/organizations(${organization.id})/logo`)
      .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

    await store.dispatch(fetchLogo(organization.id));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchLogoRequest(organization.id));
    expect(actions[1]).toEqual(fetchLogoSuccess(organization.id, logo, metaData));
  });

  it('dispatches a success action due to a 404', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).reply(404);

      await store.dispatch(fetchLogo(organization.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchLogoRequest(organization.id));
      expect(actions[1]).toEqual(fetchLogoSuccess(organization.id));
    }
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/logo`).networkError();

      await store.dispatch(fetchLogo(organization.id));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchLogoRequest(organization.id));
      expect(actions[1]).toEqual(fetchLogoFailure(error));
    }
  });
});
