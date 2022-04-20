import axios, { AxiosError } from 'axios';
import { IImage } from 'interfaces/image';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchCoverPhotoRequest = () =>
  ({
    type: 'FETCH_COVER_PHOTO_REQUEST'
  } as const);

export const fetchCoverPhotoSuccess = (payload?: IImage) =>
  ({
    type: 'FETCH_COVER_PHOTO_SUCCESS',
    payload
  } as const);

export const fetchCoverPhotoFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_COVER_PHOTO_FAILURE',
    error
  } as const;
};

const shouldFetchCoverPhoto = ({ photoGalleryCoverPhoto: { isFetching } }: RootState) => !isFetching;

export const fetchCoverPhoto = (
  organizationId: string
): ThunkAction<Promise<IImage>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchCoverPhotoRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .filter(({ filterBy }) => filterBy('isDeleted', Equals, false).filterBy('isCoverPhoto', Equals, true))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IUploadedImage[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/images`,
        {
          params
        }
      );

      if (value.length) {
        const metaData = value[0];
        const { data, headers } = await axios.get<BlobPart>(
          `/files/v3.01/organizations(${organizationId})/imagethumbnails(${metaData.id})`,
          {
            responseType: 'arraybuffer'
          }
        );

        const image: IImage = {
          id: metaData.fileName,
          fileName: metaData.fileName,
          thumbnail: new Blob([data], { type: headers['content-type'] }),
          metaData,
          isCoverPhoto: metaData.isCoverPhoto
        };

        dispatch(fetchCoverPhotoSuccess(image));
        resolve(image);
      } else {
        dispatch(fetchCoverPhotoSuccess());
        resolve();
      }
    } catch (error) {
      dispatch(fetchCoverPhotoFailure(error));
      reject(error);
    }
  });

export const fetchCoverPhotoIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchCoverPhoto(getState())) {
    dispatch(fetchCoverPhoto(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchCoverPhotoRequest>
  | ReturnType<typeof fetchCoverPhotoSuccess>
  | ReturnType<typeof fetchCoverPhotoFailure>;
