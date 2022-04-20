import axios, { AxiosError } from 'axios';
import { ISite } from 'interfaces/site';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchSitesRequest = () =>
  ({
    type: 'FETCH_SITES_REQUEST'
  } as const);

const fetchSitesSuccess = (payload: ISite[]) =>
  ({
    type: 'FETCH_SITES_SUCCESS',
    payload
  } as const);

const fetchSitesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SITES_FAILURE',
    error
  } as const;
};

const shouldFetchSites = ({ sites: { isFetching } }: RootState) => !isFetching;

const fetchSites = (
  organizationId: string,
  searchTerm?: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchSitesRequest());
    const response = await axios.get<{ value: ISite[] }>(`/api/v2/organizations(${organizationId})/sites`, {
      params: {
        $filter: !!searchTerm ? `contains(tolower(name),'${searchTerm.toLowerCase()}')` : undefined
      }
    });

    dispatch(fetchSitesSuccess(response.data.value));
  } catch (error) {
    dispatch(fetchSitesFailure(error));
  }
};

export const fetchSitesIfNeeded = (
  organizationId: string,
  searchTerm?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchSites(getState())) {
    dispatch(fetchSites(organizationId, searchTerm));
  }
};

export type Actions =
  | ReturnType<typeof fetchSitesRequest>
  | ReturnType<typeof fetchSitesSuccess>
  | ReturnType<typeof fetchSitesFailure>;
