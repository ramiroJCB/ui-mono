import axios, { AxiosError } from 'axios';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchLogoRequest = (organizationId: string) =>
  ({
    type: 'FETCH_LOGO_REQUEST',
    organizationId
  } as const);

export const fetchLogoSuccess = (organizationId: string, payload?: Blob, metaData?: IUploadedLogo) =>
  ({
    type: 'FETCH_LOGO_SUCCESS',
    organizationId,
    payload,
    metaData
  } as const);

export const fetchLogoFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_LOGO_FAILURE',
    error
  } as const;
};

const shouldFetchLogo = ({ logo: { isFetching } }: RootState) => !isFetching;

export const fetchLogo = (
  organizationId: string
): ThunkAction<Promise<Blob>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchLogoRequest(organizationId));

      const { data: metaData } = await axios.get<IUploadedLogo>(`/api/v3.01/organizations(${organizationId})/logo`);

      if (metaData) {
        const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/organizations(${organizationId})/logo`, {
          responseType: 'arraybuffer'
        });

        const logo = new Blob([data], { type: headers['content-type'] });

        dispatch(fetchLogoSuccess(organizationId, logo, metaData));
        resolve(logo);
      } else {
        dispatch(fetchLogoSuccess(organizationId));
        resolve();
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(fetchLogoSuccess(organizationId));
      } else {
        dispatch(fetchLogoFailure(error));
      }

      reject(error);
    }
  });

export const fetchLogoIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchLogo(getState())) {
    dispatch(fetchLogo(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchLogoRequest>
  | ReturnType<typeof fetchLogoSuccess>
  | ReturnType<typeof fetchLogoFailure>;
