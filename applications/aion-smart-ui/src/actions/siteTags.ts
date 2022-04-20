import axios, { AxiosError } from 'axios';
import { ISiteTag } from 'interfaces/siteTag';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchSiteTagsRequest = () =>
  ({
    type: 'FETCH_SITE_TAGS_REQUEST'
  } as const);

const fetchSiteTagsSuccess = (payload: ISiteTag[]) =>
  ({
    type: 'FETCH_SITE_TAGS_SUCCESS',
    payload
  } as const);

const fetchSiteTagsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SITE_TAGS_FAILURE',
    error
  } as const;
};

const shouldFetchSiteTags = ({ siteTags: { isFetching } }: RootState) => !isFetching;

const fetchSiteTags = (organizationId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchSiteTagsRequest());

    const response = await axios.get<{ value: ISiteTag[] }>(`/api/v2/organizations(${organizationId})/tags`);

    dispatch(fetchSiteTagsSuccess(response.data.value));
  } catch (error) {
    dispatch(fetchSiteTagsFailure(error));
  }
};

export const fetchSiteTagsIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchSiteTags(getState())) {
    dispatch(fetchSiteTags(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchSiteTagsRequest>
  | ReturnType<typeof fetchSiteTagsSuccess>
  | ReturnType<typeof fetchSiteTagsFailure>;
