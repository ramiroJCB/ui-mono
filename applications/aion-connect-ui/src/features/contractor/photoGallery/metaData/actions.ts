import axios, { AxiosError } from 'axios';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchPhotoGalleryMetaDataRequest = () =>
  ({
    type: 'FETCH_PHOTO_GALLERY_METADATA_REQUEST'
  } as const);

export const fetchPhotoGalleryMetaDataSuccess = (payload: IUploadedImage[], organizationId: string) =>
  ({
    type: 'FETCH_PHOTO_GALLERY_METADATA_SUCCESS',
    payload,
    organizationId
  } as const);

export const fetchPhotoGalleryMetaDataFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PHOTO_GALLERY_METADATA_FAILURE',
    error
  } as const;
};

const shouldFetchPhotoGalleryMetaData = (
  { photoGalleryMetaData: { isFetching, metaData, organizationId } }: RootState,
  currentOrganizationId: string
) => (!isFetching && metaData.length === 0) || organizationId !== currentOrganizationId;

export const fetchPhotoGalleryMetaData = (
  organizationId: string,
  contractorId?: string
): ThunkAction<Promise<IUploadedImage[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchPhotoGalleryMetaDataRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder().filter(({ filterBy }) => filterBy('isDeleted', Equals, false)).toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IUploadedImage[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${contractorId || organizationId})/images`,
        {
          params
        }
      );

      dispatch(fetchPhotoGalleryMetaDataSuccess(value, contractorId || organizationId));
      resolve(value);
    } catch (error) {
      dispatch(fetchPhotoGalleryMetaDataFailure(error));
      reject(error);
    }
  });

export const fetchPhotoGalleryMetaDataIfNeeded = (
  organizationId: string,
  contractorId?: string
): ThunkAction<Promise<IUploadedImage[]>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async resolve => {
    if (shouldFetchPhotoGalleryMetaData(getState(), contractorId || organizationId)) {
      const metaData = await dispatch(fetchPhotoGalleryMetaData(organizationId, contractorId));
      resolve(metaData);
    } else {
      const { metaData } = getState().photoGalleryMetaData;
      resolve([...metaData]);
    }
  });

export type Actions =
  | ReturnType<typeof fetchPhotoGalleryMetaDataRequest>
  | ReturnType<typeof fetchPhotoGalleryMetaDataSuccess>
  | ReturnType<typeof fetchPhotoGalleryMetaDataFailure>;
