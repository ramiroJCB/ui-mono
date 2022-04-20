import axios, { AxiosError } from 'axios';
import { ISite } from 'interfaces/site';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchSiteRequest = () =>
  ({
    type: 'FETCH_SITE_REQUEST'
  } as const);

const fetchSiteSuccess = (payload: ISite) =>
  ({
    type: 'FETCH_SITE_SUCCESS',
    payload
  } as const);

const fetchSiteFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SITE_FAILURE',
    error
  } as const;
};

const shouldFetchSite = ({ site: { site, isFetching } }: RootState, siteId: string) =>
  !isFetching && (!site || site.id !== siteId);

const fetchSite = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchSiteRequest());

    const response = await axios.get<ISite>(`/api/v2/organizations(${organizationId})/sites(${siteId})`);
    dispatch(fetchSiteSuccess(response.data));
  } catch (error) {
    dispatch(fetchSiteFailure(error));
  }
};

export const fetchSiteIfNeeded = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchSite(getState(), siteId)) {
    dispatch(fetchSite(organizationId, siteId));
  }
};

export type Actions =
  | ReturnType<typeof fetchSiteRequest>
  | ReturnType<typeof fetchSiteSuccess>
  | ReturnType<typeof fetchSiteFailure>;
