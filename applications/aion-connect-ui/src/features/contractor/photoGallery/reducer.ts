import { Actions as AddPhotoGalleryImageActions } from './actions/addPhotoGalleryImage';
import { Actions as DeletePhotoGalleryImageActions } from './actions/deletePhotoGalleryImage';
import { Actions as FetchPhotoGalleryImagesActions } from './actions/fetchPhotoGalleryImages';
import { Actions as FetchPhotoGalleryThumbnailsActions } from './actions/fetchPhotoGalleryThumbnails';
import { Actions as SetCoverImageActions } from './coverPhoto/actions/setCoverPhoto';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IImage, RejectedImageFailure } from 'interfaces/image';

export type State = DeepReadonly<{
  isFetchingThumbnails: boolean;
  isFetchingImages: boolean;
  limitExceeded: boolean;
  acceptedImages: IImage[];
  rejectedImages: IImage[];
  imagesError: AxiosError | Error | null;
}>;

type Actions =
  | FetchPhotoGalleryThumbnailsActions
  | FetchPhotoGalleryImagesActions
  | AddPhotoGalleryImageActions
  | DeletePhotoGalleryImageActions
  | SetCoverImageActions;

export const initialState: State = {
  isFetchingThumbnails: false,
  isFetchingImages: false,
  limitExceeded: false,
  acceptedImages: [],
  rejectedImages: [],
  imagesError: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_PHOTO_GALLERY_IMAGE_REQUEST':
      return {
        ...state,
        rejectedImages: state.rejectedImages.map(image =>
          image.id === action.payload.id
            ? { ...image, uploadProgress: 0, error: undefined, retryUpload: undefined }
            : image
        )
      };
    case 'ADD_PHOTO_GALLERY_IMAGE_SUCCESS':
      return {
        ...state,
        acceptedImages:
          !action.payload.retryUpload && state.acceptedImages.some(image => image.id === action.payload.id)
            ? state.acceptedImages.map(image => (image.id === action.payload.id ? action.payload : image))
            : [action.payload, ...state.acceptedImages],
        rejectedImages: state.rejectedImages.filter(image => image.id !== action.payload.id)
      };
    case 'ADD_PHOTO_GALLERY_IMAGE_FAILURE':
      return {
        ...state,
        acceptedImages: state.acceptedImages.filter(image => image.id !== action.image.id),
        rejectedImages: !action.image.retryUpload
          ? [action.image, ...state.rejectedImages]
          : state.rejectedImages.map(image =>
              image.id === action.image.id
                ? { ...image, uploadProgress: 0, error: RejectedImageFailure.NetworkError }
                : image
            )
      };
    case 'PHOTO_GALLERY_IMAGE_PROGRESS':
      return {
        ...state,
        acceptedImages: state.acceptedImages.map(image =>
          image.id === action.id ? { ...image, uploadProgress: action.payload } : image
        ),
        rejectedImages: state.rejectedImages.map(image =>
          image.id === action.id ? { ...image, uploadProgress: action.payload } : image
        )
      };
    case 'PROCESS_IMAGE_SUCCESS':
      return {
        ...state,
        acceptedImages: [action.payload, ...state.acceptedImages]
      };
    case 'PROCESS_IMAGE_ERROR':
      return {
        ...state,
        rejectedImages: [action.payload, ...state.rejectedImages]
      };
    case 'PROCESS_IMAGE_LIMIT_EXCEEDED':
      return {
        ...state,
        limitExceeded: true
      };
    case 'SET_COVER_PHOTO_REQUEST':
    case 'DELETE_PHOTO_GALLERY_IMAGE_REQUEST':
      return {
        ...state,
        acceptedImages: state.acceptedImages.map(image =>
          image.metaData && image.metaData.id === action.payload ? { ...image, isLoading: true } : image
        )
      };
    case 'DELETE_PHOTO_GALLERY_IMAGE_SUCCESS':
      return {
        ...state,
        limitExceeded: false,
        acceptedImages: state.acceptedImages.filter(image => image.metaData && image.metaData.id !== action.payload)
      };
    case 'SET_COVER_PHOTO_FAILURE':
    case 'DELETE_PHOTO_GALLERY_IMAGE_FAILURE':
      return {
        ...state,
        acceptedImages: state.acceptedImages.map(image =>
          image.metaData && image.metaData.id === action.payload
            ? { ...image, isLoading: false, error: RejectedImageFailure.NetworkError }
            : image
        )
      };
    case 'DELETE_IMAGE_SUCCESS':
      return {
        ...state,
        acceptedImages: state.acceptedImages.filter(image => image.id !== action.payload),
        rejectedImages: state.rejectedImages.filter(image => image.id !== action.payload)
      };
    case 'SET_COVER_PHOTO_SUCCESS':
      return {
        ...state,
        acceptedImages: state.acceptedImages.map(image =>
          image.isCoverPhoto
            ? { ...image, isCoverPhoto: false, isLoading: false }
            : image.id === action.payload.id
            ? action.payload
            : image
        )
      };
    case 'FETCH_PHOTO_GALLERY_THUMBNAILS_REQUEST':
      return {
        ...state,
        isFetchingThumbnails: true,
        imagesError: null
      };
    case 'FETCH_PHOTO_GALLERY_IMAGES_REQUEST':
      return {
        ...state,
        isFetchingImages: true,
        imagesError: null
      };
    case 'FETCH_PHOTO_GALLERY_THUMBNAILS_SUCCESS':
      return {
        ...state,
        acceptedImages: action.payload,
        isFetchingThumbnails: false
      };
    case 'FETCH_PHOTO_GALLERY_IMAGES_SUCCESS':
      return {
        ...state,
        acceptedImages: state.acceptedImages.map(imageWithThumbnail => {
          const imageWithFullSize = action.payload.find(
            imageWithFullSize => imageWithThumbnail.id === imageWithFullSize.id
          );

          return imageWithFullSize
            ? { ...imageWithThumbnail, fullSize: imageWithFullSize.fullSize }
            : imageWithThumbnail;
        }),
        isFetchingImages: false
      };
    case 'PROCESS_IMAGES_ERROR':
    case 'FETCH_PHOTO_GALLERY_THUMBNAILS_FAILURE':
    case 'FETCH_PHOTO_GALLERY_IMAGES_FAILURE':
      return {
        ...state,
        isFetchingThumbnails: false,
        isFetchingImages: false,
        imagesError: action.error
      };
    default:
      return state;
  }
}
