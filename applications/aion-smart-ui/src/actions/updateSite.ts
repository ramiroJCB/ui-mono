import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { ISite } from 'interfaces/site';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const updateSiteRequest = () =>
  ({
    type: 'UPDATE_SITE_REQUEST'
  } as const);

export const updateSiteSuccess = (payload: ISite) =>
  ({
    type: 'UPDATE_SITE_SUCCESS',
    payload
  } as const);

export const updateSiteFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_SITE_FAILURE',
    error
  } as const;
};

export const updateSite = (
  site: ISite,
  history: History
): ThunkAction<Promise<ISite>, RootState, null, Actions> => dispatch => {
  return new Promise<ISite>(async (resolve, reject) => {
    try {
      dispatch(updateSiteRequest());

      const { organizationId, id: siteId } = site;

      const siteToEndPoint = Object.keys(site).reduce((acc: {}, cur: string) => {
        switch (cur) {
          case 'workGroups':
            if (site[cur] !== null) acc[cur] = site[cur];
            break;
          case 'itemsWorkgroups':
            break;
          default:
            acc[cur] = site[cur];
            break;
        }
        return acc;
      }, {});

      const response = await axios.put<ISite>(
        `/api/v2/organizations(${organizationId})/sites(${siteId})`,
        siteToEndPoint
      );
      const updatedSite = response.data;

      dispatch(updateSiteSuccess(updatedSite));

      history.push(`/${organizationId}/sites/${siteId}/info`);

      resolve(updatedSite);
    } catch (error) {
      dispatch(updateSiteFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateSiteRequest>
  | ReturnType<typeof updateSiteSuccess>
  | ReturnType<typeof updateSiteFailure>;
