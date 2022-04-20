import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { ISite } from 'interfaces/site';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addSiteRequest = () =>
  ({
    type: 'ADD_SITE_REQUEST'
  } as const);

export const addSiteSuccess = (payload: ISite) =>
  ({
    type: 'ADD_SITE_SUCCESS',
    payload
  } as const);

export const addSiteFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_SITE_FAILURE',
    error
  } as const;
};

export const addSite = (
  site: ISite,
  history: History
): ThunkAction<Promise<ISite>, RootState, null, Actions> => dispatch => {
  return new Promise<ISite>(async (resolve, reject) => {
    try {
      dispatch(addSiteRequest());

      const { organizationId } = site;
      const response = await axios.post<ISite>(`/api/v2/organizations(${organizationId})/sites`, {
        numContacts: 0,
        numWorkersOnSite: 0,
        ...site
      });
      const newSite = response.data;
      const { id: siteId } = newSite;

      dispatch(addSiteSuccess(newSite));

      history.push(`/${organizationId}/sites/${siteId}/info`);

      resolve(newSite);
    } catch (error) {
      dispatch(addSiteFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addSiteRequest>
  | ReturnType<typeof addSiteSuccess>
  | ReturnType<typeof addSiteFailure>;
