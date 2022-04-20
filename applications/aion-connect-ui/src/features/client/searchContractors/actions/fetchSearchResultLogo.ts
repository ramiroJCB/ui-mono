import axios, { AxiosError } from 'axios';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchSearchResultLogoRequest = (organizationId: string) =>
  ({
    type: 'FETCH_SEARCH_RESULT_LOGO_REQUEST',
    organizationId
  } as const);

export const fetchSearchResultLogoSuccess = (organizationId: string, payload?: Blob, metaData?: IUploadedLogo) =>
  ({
    type: 'FETCH_SEARCH_RESULT_LOGO_SUCCESS',
    organizationId,
    payload,
    metaData
  } as const);

export const fetchSearchResultLogoFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SEARCH_RESULT_LOGO_FAILURE',
    error
  } as const;
};

export const fetchSearchResultLogo = (
  organizationId: string
): ThunkAction<Promise<Blob>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSearchResultLogoRequest(organizationId));

      const { data: metaData } = await axios.get<IUploadedLogo>(`/api/v3.01/organizations(${organizationId})/logo`);

      if (metaData) {
        const { data, headers } = await axios.get<BlobPart>(`/files/v3.01/organizations(${organizationId})/logo`, {
          responseType: 'arraybuffer'
        });

        const logo = new Blob([data], { type: headers['content-type'] });

        dispatch(fetchSearchResultLogoSuccess(organizationId, logo, metaData));
        resolve(logo);
      } else {
        dispatch(fetchSearchResultLogoSuccess(organizationId));
        resolve();
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(fetchSearchResultLogoSuccess(organizationId));
      } else {
        dispatch(fetchSearchResultLogoFailure(error));
      }

      reject(error);
    }
  });

export const fetchSearchResultLogoIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  const { searchResults } = getState().searchResults;
  const searchResult = searchResults.find(result => result.id === organizationId);

  if (!searchResult?.hasFetched && !searchResult?.isFetching) {
    dispatch(fetchSearchResultLogo(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchSearchResultLogoRequest>
  | ReturnType<typeof fetchSearchResultLogoSuccess>
  | ReturnType<typeof fetchSearchResultLogoFailure>;
