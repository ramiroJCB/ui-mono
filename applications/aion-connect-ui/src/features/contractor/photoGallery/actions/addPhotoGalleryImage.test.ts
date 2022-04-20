import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  addPhotoGalleryImage,
  addPhotoGalleryImageFailure,
  addPhotoGalleryImageRequest,
  addPhotoGalleryImageSuccess,
  photoGalleryImageUploadProgress,
  processImageLimitExceeded,
  processImages
} from './addPhotoGalleryImage';
import { IImage, RejectedImageFailure } from 'interfaces/image';
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

describe('fetch photo gallery images', () => {
  const image: IImage = {
    id: 'test.jpg_0',
    fileName: 'test.jpg',
    thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
    fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
  };

  it('dipatches a success action with the new uploaded image', async () => {
    const response: IUploadedImage = {
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

    axiosMock.onPost(`/api/v3.01/organizations(${organizationId})/images`).reply((config: any) => {
      config.onUploadProgress({ loaded: 1, total: 1 });
      return [200, response];
    });

    await store.dispatch(addPhotoGalleryImage(organizationId, image));

    const actions = store.getActions();

    expect(actions[0]).toEqual(addPhotoGalleryImageRequest(image));
    expect(actions[1]).toEqual(photoGalleryImageUploadProgress(100, image.id));
    expect(actions[2]).toEqual(
      addPhotoGalleryImageSuccess({ ...image, metaData: response, retryUpload: false, error: undefined })
    );
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPost(`/api/v3.01/organizations(${organizationId})/images`).networkError();

      await store.dispatch(addPhotoGalleryImage(organizationId, image));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(addPhotoGalleryImageRequest(image));
      expect(actions[1]).toEqual(
        addPhotoGalleryImageFailure(error, { ...image, error: RejectedImageFailure.NetworkError })
      );
    }
  });

  it('dispatches process image limit exceeded', async () => {
    const acceptedImages: IImage[] = [];

    for (let i = 0; i <= 9; i++) {
      acceptedImages.push(image);
    }

    const store = mockStore({ photoGallery: { ...initialState, acceptedImages } });
    const response = await fetch(
      'data:image/jpeg;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    );
    const blob = await response.blob();
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    await store.dispatch(processImages(organizationId, [file]));

    const actions = store.getActions();

    expect(actions[0]).toEqual(processImageLimitExceeded());
  });
});
