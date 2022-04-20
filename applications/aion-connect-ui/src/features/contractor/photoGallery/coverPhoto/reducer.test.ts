import { error, organizations } from '../../../../../fixtures';
import { IImage } from 'interfaces/image';
import { initialState, reducer, State } from './reducer';
import { IUploadedImage } from 'interfaces/uploadedImage';

let prevState: State;
const organizationId = organizations[2].id;

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

beforeEach(() => {
  prevState = initialState;
});

describe('photo gallery reducer', () => {
  it('should set isCoverPhoto to false for the existing cover image when dispatching SET_COVER_PHOTO_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      isCoverPhoto: true,
      metaData
    };

    const nextState = reducer(prevState, {
      type: 'SET_COVER_PHOTO_SUCCESS',
      payload: image
    });

    expect(prevState.coverPhoto).toBeUndefined();
    expect(nextState.coverPhoto).toEqual(image);
  });

  it('should update state correctly when dispatching FETCH_COVER_PHOTO_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_COVER_PHOTO_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
    expect(nextState.error).toBeNull();
  });

  it('should update state correctly when dispatching FETCH_COVER_PHOTO_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData,
      isCoverPhoto: true
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_COVER_PHOTO_SUCCESS',
      payload: image
    });

    expect(prevState.coverPhoto).toBeUndefined();
    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.coverPhoto).toEqual(image);
  });

  it('should update state correctly when dispatching FETCH_COVER_PHOTO_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_COVER_PHOTO_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
