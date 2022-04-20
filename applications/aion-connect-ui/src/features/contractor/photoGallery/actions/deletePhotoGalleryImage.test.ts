import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  deleteImage,
  deleteImageSuccess,
  deletePhotoGalleryImageFailure,
  deletePhotoGalleryImageRequest,
  deletePhotoGalleryImageSuccess
} from './deletePhotoGalleryImage';
import { IImage } from 'interfaces/image';
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

describe('delete photo gallery image', () => {
  const image: IImage = {
    id: 'test.jpg_0',
    fileName: 'test.jpg',
    thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
    fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
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

  it('dipatches a success action when deleteing a photo that has not been uploaded', async () => {
    await store.dispatch(deleteImage(organizationId, image));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deleteImageSuccess(image.id));
  });

  it('dipatches a success action when deleteing a photo that has been uploaded', async () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organizationId})/images(${metaData.id})`).reply(200);

    await store.dispatch(deleteImage(organizationId, { ...image, metaData }));

    const actions = store.getActions();

    expect(actions[0]).toEqual(deletePhotoGalleryImageRequest(metaData.id));
    expect(actions[1]).toEqual(deletePhotoGalleryImageSuccess(metaData.id));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onDelete(`/api/v3.01/organizations(${organizationId})/images(${metaData.id})`).networkError();

      await store.dispatch(deleteImage(organizationId, image));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(deletePhotoGalleryImageRequest(metaData.id));
      expect(actions[1]).toEqual(deletePhotoGalleryImageFailure(error, metaData.id));
    }
  });
});
