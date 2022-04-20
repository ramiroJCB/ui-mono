import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import {
  Actions,
  setCoverPhoto,
  setCoverPhotoFailure,
  setCoverPhotoRequest,
  setCoverPhotoSuccess
} from './setCoverPhoto';
import { IImage } from 'interfaces/image';
import { initialState } from '../../reducer';
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

describe('set cover photo', () => {
  const image: IImage = {
    id: 'test.jpg_0',
    fileName: 'test.jpg',
    thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
    fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
    metaData: {
      id: 'd43d747e-274c-4517-a64e-ed30b833e790',
      organizationId,
      isDeleted: false,
      fileName: 'test.jpg',
      mimeType: 'image/jpeg',
      storagePath: 'organization-images/f2d16e64-25de-4357-add9-b82d1d94ce40.jpg',
      thumbnailId: 'e755597a-2c52-416f-a0bd-2401d7603cbc',
      thumbnailStoragePath: 'organization-images/2bf97a15-0d9c-4c62-ad96-e1da88a71950.jpg',
      isCoverPhoto: false
    }
  };

  it('dipatches a success action when setting the cover photo of an uploaded image', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organizationId})/images(${image.metaData!.id})`)
      .reply(200, { ...image.metaData, isCoverPhoto: true });

    await store.dispatch(setCoverPhoto(organizationId, image));

    const actions = store.getActions();

    expect(actions[0]).toEqual(setCoverPhotoRequest(image.metaData!.id));
    expect(actions[1]).toEqual(setCoverPhotoSuccess({ ...image, isCoverPhoto: true }));
  });

  it('dipatches a success action when unsetting the current cover photo', async () => {
    axiosMock
      .onPut(`/api/v3.01/organizations(${organizationId})/images(${image.metaData!.id})`)
      .reply(200, { ...image.metaData, isCoverPhoto: false });

    const axiosSpy = jest.spyOn(axios, 'put');
    const store = mockStore({
      photoGallery: { ...initialState, acceptedImages: [{ ...image, isCoverPhoto: true }, image] }
    });

    await store.dispatch(setCoverPhoto(organizationId, image));

    const actions = store.getActions();

    expect(axiosSpy).toHaveBeenCalledTimes(1);
    expect(actions[0]).toEqual(setCoverPhotoRequest(image.metaData!.id));
    expect(actions[1]).toEqual(setCoverPhotoSuccess({ ...image, isCoverPhoto: false }));
  });

  it('dispatches a failure action due to a network error', async () => {
    try {
      axiosMock.onPost('/spapi/errors').reply(200);
      axiosMock.onPut(`/api/v3.01/organizations(${organizationId})/images(${image.metaData!.id})`).networkError();

      await store.dispatch(setCoverPhoto(organizationId, image));
    } catch (error) {
      const actions = store.getActions();

      expect(actions[0]).toEqual(setCoverPhotoRequest(image.metaData!.id));
      expect(actions[1]).toEqual(setCoverPhotoFailure(error, image.metaData!.id));
    }
  });
});
