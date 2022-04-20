import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  fetchPhotoGalleryMetaData,
  fetchPhotoGalleryMetaDataFailure,
  fetchPhotoGalleryMetaDataRequest,
  fetchPhotoGalleryMetaDataSuccess
} from './actions';
import { initialState } from '../reducer';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { RootState } from 'combineReducers';

const { organizations } = fixtures;
const organizationId = organizations[2].id;
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({ photoGallery: initialState });

beforeEach(() => {
  axiosMock.reset();
  store.clearActions();
});

describe('fetch photo gallery metadata', () => {
  it('dipatches a success action when fetching metadata', async () => {
    const metaData: IUploadedImage = {
      id: 'd43d747e-274c-4517-a64e-ed30b833e790',
      organizationId,
      isDeleted: false,
      fileName: 'test.jpg',
      mimeType: 'image/jpeg',
      storagePath: 'organization-images/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
      thumbnailId: 'e755597a-2c52-416f-a0bd-2401d7603cbc',
      thumbnailStoragePath: 'organization-images/2bf97a15-0d9c-4c62-ad96-e1da88a71950.jpg',
      isCoverPhoto: false
    };

    const value: IUploadedImage[] = [];

    for (let i = 0; i <= 6; i++) {
      value.push(metaData);
    }

    axiosMock.onGet(`/api/v3.01/organizations(${organizationId})/images`).reply(200, { value });

    await store.dispatch(fetchPhotoGalleryMetaData(organizationId));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchPhotoGalleryMetaDataRequest());
    expect(actions[1]).toEqual(fetchPhotoGalleryMetaDataSuccess(value, organizationId));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet(`/api/v3.01/organizations(${organizationId})/images`).networkError();

      await store.dispatch(fetchPhotoGalleryMetaData(organizationId));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchPhotoGalleryMetaDataRequest());
      expect(actions[1]).toEqual(fetchPhotoGalleryMetaDataFailure(error));
    }
  });
});
