import * as types from '../reducers/organizations';
import axios, { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchOrganizationsRequest = () => ({
  type: types.FETCH_ORGANIZATIONS_REQUEST as typeof types.FETCH_ORGANIZATIONS_REQUEST
});

const fetchOrganizationsSuccess = (payload: IOrganization[], search: string, numResults: number) => ({
  type: types.FETCH_ORGANIZATIONS_SUCCESS as typeof types.FETCH_ORGANIZATIONS_SUCCESS,
  payload,
  search,
  numResults
});

const fetchOrganizationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: types.FETCH_ORGANIZATIONS_FAILURE as typeof types.FETCH_ORGANIZATIONS_FAILURE,
    error
  };
};

const shouldFetchOrganizations = (state: RootState, search: string) => {
  const {
    organizations: { searchTerm, isFetching }
  } = state;

  return !isFetching && search !== searchTerm;
};

const fetchOrganizations = (
  search: string,
  pageSize: number
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchOrganizationsRequest());

    const response = await axios.get<IOrganization[]>('/api/v2/organizations', {
      params: {
        search,
        pageSize
      }
    });

    const organizations = response.data;
    const totalCount = JSON.parse(response.headers['x-pagination']).TotalCount;

    dispatch(fetchOrganizationsSuccess(organizations, search, totalCount));
  } catch (error) {
    dispatch(fetchOrganizationsFailure(error));
  }
};

export const fetchOrganizationsIfNeeded = (
  search: string,
  pageSize: number = 5
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchOrganizations(getState(), search)) {
    dispatch(fetchOrganizations(search, pageSize));
  }
};

export type Actions =
  | ReturnType<typeof fetchOrganizationsRequest>
  | ReturnType<typeof fetchOrganizationsSuccess>
  | ReturnType<typeof fetchOrganizationsFailure>;
