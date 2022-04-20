import axios, { AxiosError } from 'axios';
import { fetchPhotoGalleryMetaDataIfNeeded } from '../metaData/actions';
import { IImage } from 'interfaces/image';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchPhotoGalleryThumbnailsRequest = () =>
  ({
    type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_REQUEST'
  } as const);

export const fetchPhotoGalleryThumbnailsSuccess = (payload: IImage[]) =>
  ({
    type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_SUCCESS',
    payload
  } as const);

export const fetchPhotoGalleryThumbnailsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PHOTO_GALLERY_THUMBNAILS_FAILURE',
    error
  } as const;
};

const shouldFetchPhotoGalleryThumbnails = ({ photoGallery: { isFetchingThumbnails, acceptedImages } }: RootState) =>
  !isFetchingThumbnails && acceptedImages.length === 0;

export const fetchPhotoGalleryThumbnails = (
  organizationId: string,
  contractorId?: string
): ThunkAction<Promise<IImage[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchPhotoGalleryThumbnailsRequest());

      const value = await dispatch(fetchPhotoGalleryMetaDataIfNeeded(contractorId || organizationId));
      const acceptedImages = await axios.all<IImage>(
        value.map(async (metaData, index) => {
          const { data, headers } = await axios.get<BlobPart>(
            `/files/v3.01/organizations(${contractorId || organizationId})/imagethumbnails(${metaData.id})`,
            {
              responseType: 'arraybuffer'
            }
          );

          return {
            id: `${metaData.fileName}_${index}`,
            fileName: metaData.fileName,
            thumbnail: new Blob([data], { type: headers['content-type'] }),
            metaData,
            isCoverPhoto: metaData.isCoverPhoto
          };
        })
      );

      dispatch(fetchPhotoGalleryThumbnailsSuccess(acceptedImages));
      resolve(acceptedImages);
    } catch (error) {
      dispatch(fetchPhotoGalleryThumbnailsFailure(error));
      reject(error);
    }
  });

export const fetchPhotoGalleryThumbnailsIfNeeded = (
  organizationId: string,
  contractorId?: string
): ThunkAction<Promise<IImage[]>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async resolve => {
    if (shouldFetchPhotoGalleryThumbnails(getState())) {
      const images = await dispatch(fetchPhotoGalleryThumbnails(organizationId, contractorId));
      resolve(images);
    } else {
      const { acceptedImages } = getState().photoGallery;
      resolve([...acceptedImages]);
    }
  });

export type Actions =
  | ReturnType<typeof fetchPhotoGalleryThumbnailsRequest>
  | ReturnType<typeof fetchPhotoGalleryThumbnailsSuccess>
  | ReturnType<typeof fetchPhotoGalleryThumbnailsFailure>;
