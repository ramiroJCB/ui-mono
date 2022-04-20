import axios, { AxiosError } from 'axios';
import { IRelease } from 'interfaces/release';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReleasesRequest = () =>
  ({
    type: 'FETCH_RELEASES_REQUEST'
  } as const);

const fetchReleasesSuccess = (payload: IRelease[]) =>
  ({
    type: 'FETCH_RELEASES_SUCCESS',
    payload
  } as const);

const fetchReleasesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_RELEASES_FAILURE',
    error
  } as const;
};

const shouldFetchReleases = (state: RootState) => !state.releases.isFetching;

const fetchReleases = (organizationId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchReleasesRequest());

    const response = await axios.get<IRelease[]>(`/api/v2/organizations/${organizationId}/releases`, {
      params: {
        filter: `RequestedById ne '${organizationId}'`
      }
    });

    dispatch(fetchReleasesSuccess(response.data));
  } catch (error) {
    dispatch(fetchReleasesFailure(error));
  }
};

export const fetchReleasesIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchReleases(getState())) {
    dispatch(fetchReleases(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchReleasesRequest>
  | ReturnType<typeof fetchReleasesSuccess>
  | ReturnType<typeof fetchReleasesFailure>;
