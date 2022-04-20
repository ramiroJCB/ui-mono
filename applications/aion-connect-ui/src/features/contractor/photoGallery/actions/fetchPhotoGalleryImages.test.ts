import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions as FetchPhotoGalleryImagesActions,
  fetchPhotoGalleryImages,
  fetchPhotoGalleryImagesFailure,
  fetchPhotoGalleryImagesRequest,
  fetchPhotoGalleryImagesSuccess
} from './fetchPhotoGalleryImages';
import {
  Actions as FetchPhotoGalleryMetaDataActions,
  fetchPhotoGalleryMetaDataRequest,
  fetchPhotoGalleryMetaDataSuccess
} from '../metaData/actions';
import { IImage } from 'interfaces/image';
import { initialState as photoGalleryInitialState } from '../reducer';
import { initialState as photoGalleryMetaDataInitialState } from '../metaData/reducer';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { RootState } from 'combineReducers';

type Actions = FetchPhotoGalleryImagesActions | FetchPhotoGalleryMetaDataActions;

const { organizations } = fixtures;
const organizationId = organizations[2].id;
const mockStore = configureStore<Partial<RootState>, ThunkDispatch<RootState, null, Actions>>([thunk]);
const axiosMock = new MockAdapter(axios);
const store = mockStore({
  photoGallery: photoGalleryInitialState,
  photoGalleryMetaData: photoGalleryMetaDataInitialState
});
const image: IImage = {
  id: 'test.jpg_0',
  fileName: 'test.jpg',
  fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
  isCoverPhoto: false
};

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
const acceptedImages: IImage[] = [];

for (let i = 0; i <= 6; i++) {
  value.push(metaData);
  acceptedImages.push({ ...image, id: `${metaData.fileName}_${i}`, metaData });
}

beforeEach(() => {
  axiosMock.reset();
  axiosMock.onGet(`/api/v3.01/organizations(${organizationId})/images`).reply(200, { value });
  store.clearActions();
});

describe('fetch photo gallery images', () => {
  it('dipatches a success action when fetching uploaded images', async () => {
    axiosMock
      .onGet(`/files/v3.01/organizations(${organizationId})/images(${metaData.id})`)
      .reply(200, new Blob(['foobar'], { type: 'image/jpeg' }), { 'content-type': 'image/jpeg' });

    await store.dispatch(fetchPhotoGalleryImages(organizationId));

    const actions = store.getActions();

    expect(actions[0]).toEqual(fetchPhotoGalleryImagesRequest());
    expect(actions[1]).toEqual(fetchPhotoGalleryMetaDataRequest());
    expect(actions[2]).toEqual(fetchPhotoGalleryMetaDataSuccess(value, organizationId));
    expect(actions[3]).toEqual(fetchPhotoGalleryImagesSuccess(acceptedImages));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onGet(`/files/v3.01/organizations(${organizationId})/images(${metaData.id})`).networkError();

      await store.dispatch(fetchPhotoGalleryImages(organizationId));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(fetchPhotoGalleryImagesRequest());
      expect(actions[1]).toEqual(fetchPhotoGalleryMetaDataRequest());
      expect(actions[2]).toEqual(fetchPhotoGalleryMetaDataSuccess(value, organizationId));
      expect(actions[3]).toEqual(fetchPhotoGalleryImagesFailure(error));
    }
  });
});
