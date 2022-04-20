import axios, { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IImage } from 'interfaces/image';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const setCoverPhotoRequest = (payload: string) =>
  ({
    type: 'SET_COVER_PHOTO_REQUEST',
    payload
  } as const);

export const setCoverPhotoSuccess = (payload: DeepReadonly<IImage>) =>
  ({
    type: 'SET_COVER_PHOTO_SUCCESS',
    payload
  } as const);

export const setCoverPhotoFailure = (error: AxiosError, payload: string) => {
  sendError(error);
  return {
    type: 'SET_COVER_PHOTO_FAILURE',
    error,
    payload
  } as const;
};

export const setCoverPhoto = (
  organizationId: string,
  image: DeepReadonly<IImage>
): ThunkAction<Promise<void>, RootState, null, Actions> => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    if (image.metaData) {
      try {
        dispatch(setCoverPhotoRequest(image.metaData.id));

        const { acceptedImages } = getState().photoGallery;
        const currentCoverPhoto = acceptedImages.find(image => image.isCoverPhoto);

        if (currentCoverPhoto && currentCoverPhoto.metaData && currentCoverPhoto.metaData.id !== image.metaData.id) {
          await axios.all([
            axios.put<IUploadedImage>(
              `/api/v3.01/organizations(${organizationId})/images(${currentCoverPhoto.metaData.id})`,
              { ...currentCoverPhoto.metaData, isCoverPhoto: false }
            ),
            axios.put<IUploadedImage>(`/api/v3.01/organizations(${organizationId})/images(${image.metaData.id})`, {
              ...image.metaData,
              isCoverPhoto: true
            })
          ]);

          dispatch(setCoverPhotoSuccess({ ...image, isCoverPhoto: true, error: undefined }));
          resolve();
        } else if (
          currentCoverPhoto &&
          currentCoverPhoto.metaData &&
          currentCoverPhoto.metaData.id === image.metaData.id
        ) {
          await axios.put<IUploadedImage>(`/api/v3.01/organizations(${organizationId})/images(${image.metaData.id})`, {
            ...image.metaData,
            isCoverPhoto: false
          });

          dispatch(setCoverPhotoSuccess({ ...image, isCoverPhoto: false, error: undefined }));
          resolve();
        } else if (image.metaData) {
          await axios.put<IUploadedImage>(`/api/v3.01/organizations(${organizationId})/images(${image.metaData.id})`, {
            ...image.metaData,
            isCoverPhoto: true
          });

          dispatch(setCoverPhotoSuccess({ ...image, isCoverPhoto: true, error: undefined }));
          resolve();
        }
      } catch (error) {
        dispatch(setCoverPhotoFailure(error, image.metaData.id));
        reject(error);
      }
    } else {
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof setCoverPhotoRequest>
  | ReturnType<typeof setCoverPhotoSuccess>
  | ReturnType<typeof setCoverPhotoFailure>;
