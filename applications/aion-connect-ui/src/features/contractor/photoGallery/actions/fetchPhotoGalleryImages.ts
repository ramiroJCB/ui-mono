import axios, { AxiosError } from 'axios';
import { fetchPhotoGalleryMetaDataIfNeeded } from '../metaData/actions';
import { IImage } from 'interfaces/image';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchPhotoGalleryImagesRequest = () =>
  ({
    type: 'FETCH_PHOTO_GALLERY_IMAGES_REQUEST'
  } as const);

export const fetchPhotoGalleryImagesSuccess = (payload: IImage[]) =>
  ({
    type: 'FETCH_PHOTO_GALLERY_IMAGES_SUCCESS',
    payload
  } as const);

export const fetchPhotoGalleryImagesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PHOTO_GALLERY_IMAGES_FAILURE',
    error
  } as const;
};

const shouldFetchPhotoGalleryImages = ({ photoGallery: { isFetchingImages, acceptedImages } }: RootState) =>
  !isFetchingImages && !acceptedImages.every(image => image.fullSize);

export const fetchPhotoGalleryImages = (
  organizationId: string,
  contractorId?: string
): ThunkAction<Promise<IImage[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchPhotoGalleryImagesRequest());

      const value = await dispatch(fetchPhotoGalleryMetaDataIfNeeded(contractorId || organizationId));
      const acceptedImages = await axios.all<IImage>(
        value.map(async (metaData, index) => {
          const { data, headers } = await axios.get<BlobPart>(
            `/files/v3.01/organizations(${contractorId || organizationId})/images(${metaData.id})`,
            {
              responseType: 'arraybuffer'
            }
          );

          return {
            id: `${metaData.fileName}_${index}`,
            fileName: metaData.fileName,
            fullSize: new Blob([data], { type: headers['content-type'] }),
            metaData,
            isCoverPhoto: metaData.isCoverPhoto
          };
        })
      );

      dispatch(fetchPhotoGalleryImagesSuccess(acceptedImages));
      resolve(acceptedImages);
    } catch (error) {
      dispatch(fetchPhotoGalleryImagesFailure(error));
      reject(error);
    }
  });

export const fetchPhotoGalleryImagesIfNeeded = (
  organizationId: string,
  contractorId?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchPhotoGalleryImages(getState())) {
    dispatch(fetchPhotoGalleryImages(organizationId, contractorId));
  }
};

export type Actions =
  | ReturnType<typeof fetchPhotoGalleryImagesRequest>
  | ReturnType<typeof fetchPhotoGalleryImagesSuccess>
  | ReturnType<typeof fetchPhotoGalleryImagesFailure>;
