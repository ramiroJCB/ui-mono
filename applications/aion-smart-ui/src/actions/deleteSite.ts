import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteSiteRequest = () =>
  ({
    type: 'DELETE_SITE_REQUEST'
  } as const);

export const deleteSiteSuccess = (siteId: string) =>
  ({
    type: 'DELETE_SITE_SUCCESS',
    siteId
  } as const);

export const deleteSiteFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_SITE_FAILURE',
    error
  } as const;
};

export const deleteSite = (
  organizationId: string,
  siteId: string,
  history: History
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      dispatch(deleteSiteRequest());

      await axios.delete(`/api/v2/organizations(${organizationId})/sites(${siteId})`);

      dispatch(deleteSiteSuccess(siteId));

      history.push(`/${organizationId}/sites`);

      resolve();
    } catch (error) {
      dispatch(deleteSiteFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof deleteSiteRequest>
  | ReturnType<typeof deleteSiteSuccess>
  | ReturnType<typeof deleteSiteFailure>;
