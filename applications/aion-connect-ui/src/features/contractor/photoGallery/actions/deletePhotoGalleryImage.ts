import axios, { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IImage } from 'interfaces/image';
import { RootState } from '../../../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deletePhotoGalleryImageRequest = (payload: string) =>
  ({
    type: 'DELETE_PHOTO_GALLERY_IMAGE_REQUEST',
    payload
  } as const);

export const deletePhotoGalleryImageSuccess = (payload: string) =>
  ({
    type: 'DELETE_PHOTO_GALLERY_IMAGE_SUCCESS',
    payload
  } as const);

export const deletePhotoGalleryImageFailure = (error: AxiosError, payload: string) => {
  sendError(error);
  return {
    type: 'DELETE_PHOTO_GALLERY_IMAGE_FAILURE',
    error,
    payload
  } as const;
};

export const deleteImageSuccess = (payload: string) =>
  ({
    type: 'DELETE_IMAGE_SUCCESS',
    payload
  } as const);

export const deleteImage = (
  organizationId: string,
  image: DeepReadonly<IImage>
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    if (image.metaData) {
      try {
        await dispatch(deletePhotoGalleryImage(organizationId, image.metaData.id));
      } catch (error) {
        reject(error);
      }
    } else {
      dispatch(deleteImageSuccess(image.id));
    }

    resolve();
  });

const deletePhotoGalleryImage = (
  organizationId: string,
  imageId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deletePhotoGalleryImageRequest(imageId));

      await axios.delete(`/api/v3.01/organizations(${organizationId})/images(${imageId})`);

      dispatch(deletePhotoGalleryImageSuccess(imageId));
      resolve();
    } catch (error) {
      dispatch(deletePhotoGalleryImageFailure(error, imageId));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deletePhotoGalleryImageRequest>
  | ReturnType<typeof deletePhotoGalleryImageSuccess>
  | ReturnType<typeof deletePhotoGalleryImageFailure>
  | ReturnType<typeof deleteImageSuccess>;
