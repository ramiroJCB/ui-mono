import axios, { AxiosError } from 'axios';
import Compressor from 'compressorjs';
import { FileWithPath } from 'react-dropzone';
import { IImage, RejectedImageFailure } from 'interfaces/image';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const photoGalleryImageUploadProgress = (payload: number, id: string) =>
  ({
    type: 'PHOTO_GALLERY_IMAGE_PROGRESS',
    payload,
    id
  } as const);

export const addPhotoGalleryImageRequest = (payload: IImage) =>
  ({
    type: 'ADD_PHOTO_GALLERY_IMAGE_REQUEST',
    payload
  } as const);

export const addPhotoGalleryImageSuccess = (payload: IImage) =>
  ({
    type: 'ADD_PHOTO_GALLERY_IMAGE_SUCCESS',
    payload
  } as const);

export const addPhotoGalleryImageFailure = (error: AxiosError, image: IImage) => {
  sendError(error);
  return {
    type: 'ADD_PHOTO_GALLERY_IMAGE_FAILURE',
    error,
    image
  } as const;
};

export const processImageSuccess = (payload: IImage) =>
  ({
    type: 'PROCESS_IMAGE_SUCCESS',
    payload
  } as const);

export const processImageError = (payload: IImage) =>
  ({
    type: 'PROCESS_IMAGE_ERROR',
    payload
  } as const);

export const processImagesError = (error: Error) =>
  ({
    type: 'PROCESS_IMAGES_ERROR',
    error
  } as const);

export const processImageLimitExceeded = () =>
  ({
    type: 'PROCESS_IMAGE_LIMIT_EXCEEDED'
  } as const);

export const processImages = (
  organizationId: string,
  acceptedFiles: FileWithPath[]
): ThunkAction<Promise<IImage[]>, RootState, null, Actions> => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const { acceptedImages, rejectedImages } = getState().photoGallery;
    const imageLimit = 10;
    const maxFileSize = 3145728; // 3MB
    const currentTotal = acceptedImages.length + rejectedImages.length;

    if (currentTotal < imageLimit) {
      try {
        const images = await Promise.all(
          acceptedFiles.slice(0, imageLimit - currentTotal).map(async (file, index) => {
            const thumbnail = await new Promise<Blob>((resolve, reject) => {
              new Compressor(file, {
                quality: 0.8,
                maxHeight: 600,
                maxWidth: 600,
                success: resolve,
                error: reject
              });
            });

            const fullSize = await new Promise<Blob>((resolve, reject) => {
              new Compressor(file, {
                quality: 0.8,
                maxHeight: 1080,
                maxWidth: 1920,
                success: resolve,
                error: reject
              });
            });

            const image: IImage = {
              id: `${file.name}_${index + currentTotal}`,
              fileName: file.name,
              thumbnail,
              fullSize
            };

            if (fullSize.size < maxFileSize) {
              dispatch(processImageSuccess(image));
              dispatch(addPhotoGalleryImage(organizationId, image));
            } else {
              dispatch(processImageError({ ...image, error: RejectedImageFailure.FileSize }));
            }

            return image;
          })
        );

        resolve(images);
      } catch (error) {
        dispatch(processImagesError(error));
        reject(error);
      }
    } else {
      dispatch(processImageLimitExceeded());
      resolve();
    }
  });

export const addPhotoGalleryImage = (
  organizationId: string,
  image: IImage
): ThunkAction<Promise<IImage>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(addPhotoGalleryImageRequest(image));

    try {
      const formData = new FormData();

      if (image.fullSize) {
        formData.append('image', image.fullSize, image.fileName);
      }

      if (image.thumbnail) {
        formData.append('thumbnail', image.thumbnail, image.fileName);
      }

      const { data } = await axios.post<IUploadedImage>(
        `/api/v3.01/organizations(${organizationId})/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            dispatch(photoGalleryImageUploadProgress(percentCompleted, image.id));
          }
        }
      );

      dispatch(addPhotoGalleryImageSuccess({ ...image, metaData: data, retryUpload: false, error: undefined }));
      resolve({ ...image, metaData: data, retryUpload: false, error: undefined });
    } catch (error) {
      dispatch(addPhotoGalleryImageFailure(error, { ...image, error: RejectedImageFailure.NetworkError }));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addPhotoGalleryImageRequest>
  | ReturnType<typeof addPhotoGalleryImageSuccess>
  | ReturnType<typeof addPhotoGalleryImageFailure>
  | ReturnType<typeof photoGalleryImageUploadProgress>
  | ReturnType<typeof processImageSuccess>
  | ReturnType<typeof processImageError>
  | ReturnType<typeof processImagesError>
  | ReturnType<typeof processImageLimitExceeded>;
