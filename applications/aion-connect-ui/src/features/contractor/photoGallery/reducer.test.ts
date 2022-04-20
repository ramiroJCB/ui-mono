import { error, organizations } from '../../../../fixtures';
import { IImage, RejectedImageFailure } from 'interfaces/image';
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
  it('should remove rejected images errors and upload progress when dispatching ADD_PHOTO_GALLERY_IMAGE_REQUEST', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      error: RejectedImageFailure.NetworkError
    };

    prevState = { ...initialState, rejectedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'ADD_PHOTO_GALLERY_IMAGE_REQUEST',
      payload: image
    });

    expect(prevState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.rejectedImages).toEqual([{ ...image, uploadProgress: 0, error: undefined }]);
  });

  it('should remove from rejected images and add them as a accepted image when dispatching ADD_PHOTO_GALLERY_IMAGE_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      error: RejectedImageFailure.NetworkError
    };

    prevState = { ...initialState, rejectedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'ADD_PHOTO_GALLERY_IMAGE_SUCCESS',
      payload: image
    });

    expect(prevState.acceptedImages).toEqual([]);
    expect(prevState.rejectedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([image]);
    expect(nextState.rejectedImages).toEqual([]);
  });

  it('should not add to accepted images if attempting to retry an upload when dispatching ADD_PHOTO_GALLERY_IMAGE_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      retryUpload: false
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'ADD_PHOTO_GALLERY_IMAGE_SUCCESS',
      payload: image
    });

    expect(prevState.acceptedImages).toHaveLength(1);
    expect(nextState.acceptedImages).toHaveLength(1);
  });

  it('should remove from accepted images and add them as a rejected image when dispatching ADD_PHOTO_GALLERY_IMAGE_FAILURE', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      error: RejectedImageFailure.NetworkError
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'ADD_PHOTO_GALLERY_IMAGE_FAILURE',
      error,
      image
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(prevState.rejectedImages).toEqual([]);
    expect(nextState.acceptedImages).toEqual([]);
    expect(nextState.rejectedImages).toEqual([image]);
  });

  it('should not add to rejected images if attempting to retry an upload when dispatching ADD_PHOTO_GALLERY_IMAGE_FAILURE', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      retryUpload: false
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'ADD_PHOTO_GALLERY_IMAGE_FAILURE',
      error,
      image
    });

    expect(nextState.rejectedImages).toHaveLength(1);
  });

  it('should update upload progress when dispatching PHOTO_GALLERY_IMAGE_PROGRESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      uploadProgress: 0
    };

    prevState = { ...initialState, acceptedImages: [image], rejectedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'PHOTO_GALLERY_IMAGE_PROGRESS',
      payload: 100,
      id: image.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(prevState.rejectedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([{ ...image, uploadProgress: 100 }]);
    expect(nextState.rejectedImages).toEqual([{ ...image, uploadProgress: 100 }]);
  });

  it('should add to accepted images when dispatching PROCESS_IMAGE_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
    };

    const nextState = reducer(prevState, {
      type: 'PROCESS_IMAGE_SUCCESS',
      payload: image
    });

    expect(prevState.acceptedImages).toEqual([]);
    expect(nextState.acceptedImages).toEqual([image]);
  });

  it('should add to rejected images when dispatching PROCESS_IMAGE_ERROR', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
    };

    const nextState = reducer(prevState, {
      type: 'PROCESS_IMAGE_ERROR',
      payload: image
    });

    expect(prevState.rejectedImages).toEqual([]);
    expect(nextState.rejectedImages).toEqual([image]);
  });

  it('should set limitExceeded to true when dispatching PROCESS_IMAGE_LIMIT_EXCEEDED', () => {
    const nextState = reducer(prevState, {
      type: 'PROCESS_IMAGE_LIMIT_EXCEEDED'
    });

    expect(prevState.limitExceeded).toBeFalsy();
    expect(nextState.limitExceeded).toBeTruthy();
  });

  it('should set isLoading to true for the image that is being deleted when dispatching DELETE_PHOTO_GALLERY_IMAGE_REQUEST', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'DELETE_PHOTO_GALLERY_IMAGE_REQUEST',
      payload: image.metaData!.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([{ ...image, isLoading: true }]);
  });

  it('should set isLoading to true for the image that is being set as a cover photo when dispatching SET_COVER_PHOTO_REQUEST', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'SET_COVER_PHOTO_REQUEST',
      payload: image.metaData!.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([{ ...image, isLoading: true }]);
  });

  it('should remove an image when dispatching DELETE_PHOTO_GALLERY_IMAGE_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image], limitExceeded: true };

    const nextState = reducer(prevState, {
      type: 'DELETE_PHOTO_GALLERY_IMAGE_SUCCESS',
      payload: image.metaData!.id
    });

    expect(prevState.limitExceeded).toBeTruthy();
    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.limitExceeded).toBeFalsy();
    expect(nextState.acceptedImages).toEqual([]);
  });

  it('should set isLoading to false for the image that is being deleted when dispatching DELETE_PHOTO_GALLERY_IMAGE_FAILURE', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      isLoading: true,
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'DELETE_PHOTO_GALLERY_IMAGE_FAILURE',
      error,
      payload: image.metaData!.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([
      { ...image, isLoading: false, error: RejectedImageFailure.NetworkError }
    ]);
  });

  it('should set isLoading to false for the image that is being set as a cover photo when dispatching SET_COVER_PHOTO_FAILURE', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      isLoading: true,
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'SET_COVER_PHOTO_FAILURE',
      error,
      payload: image.metaData!.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([
      { ...image, isLoading: false, error: RejectedImageFailure.NetworkError }
    ]);
  });

  it('should remove from accepted and rejected images when dispatching DELETE_IMAGE_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' })
    };

    prevState = { ...initialState, acceptedImages: [image], rejectedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'DELETE_IMAGE_SUCCESS',
      payload: image.id
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(prevState.rejectedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([]);
    expect(nextState.rejectedImages).toEqual([]);
  });

  it('should set isCoverPhoto to false for the existing cover image when dispatching SET_COVER_PHOTO_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      fullSize: new Blob(['foobar'], { type: 'image/jpeg' }),
      isCoverPhoto: true,
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'SET_COVER_PHOTO_SUCCESS',
      payload: image
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.acceptedImages).toEqual([{ ...image, isCoverPhoto: false, isLoading: false }]);
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_THUMBNAILS_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_REQUEST'
    });

    expect(prevState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.isFetchingThumbnails).toBeTruthy();
    expect(nextState.imagesError).toBeNull();
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_IMAGES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_IMAGES_REQUEST'
    });

    expect(prevState.isFetchingImages).toBeFalsy();
    expect(nextState.isFetchingImages).toBeTruthy();
    expect(nextState.imagesError).toBeNull();
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_THUMBNAILS_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_SUCCESS',
      payload: [image]
    });

    expect(prevState.acceptedImages).toEqual([]);
    expect(nextState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.acceptedImages).toEqual([image]);
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_IMAGES_SUCCESS', () => {
    const image: IImage = {
      id: 'test.jpg_0',
      fileName: 'test.jpg',
      thumbnail: new Blob(['foobar'], { type: 'image/jpeg' }),
      metaData
    };

    prevState = { ...initialState, acceptedImages: [image] };

    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_IMAGES_SUCCESS',
      payload: [{ ...image, fullSize: new Blob(['foobar'], { type: 'image/jpeg' }) }]
    });

    expect(prevState.acceptedImages).toEqual([image]);
    expect(nextState.isFetchingImages).toBeFalsy();
    expect(nextState.acceptedImages).toEqual([{ ...image, fullSize: new Blob(['foobar'], { type: 'image/jpeg' }) }]);
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_THUMBNAILS_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_FAILURE',
      error
    });

    expect(nextState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.isFetchingImages).toBeFalsy();
    expect(nextState.imagesError).toEqual(error);
  });

  it('should update state correctly when dispatching FETCH_PHOTO_GALLERY_IMAGES_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_PHOTO_GALLERY_IMAGES_FAILURE',
      error
    });

    expect(nextState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.isFetchingImages).toBeFalsy();
    expect(nextState.imagesError).toEqual(error);
  });

  it('should update state correctly when dispatching PROCESS_IMAGES_ERROR', () => {
    const nextState = reducer(prevState, {
      type: 'PROCESS_IMAGES_ERROR',
      error
    });

    expect(nextState.isFetchingThumbnails).toBeFalsy();
    expect(nextState.isFetchingImages).toBeFalsy();
    expect(nextState.imagesError).toEqual(error);
  });
});
