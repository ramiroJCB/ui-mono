import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
const fetchOrganizationsRequest = () =>
  ({
    type: 'FETCH_ORGANIZATIONS_REQUEST'
  } as const);

const fetchOrganizationsSuccess = (payload: IOrganization[], numResults: number) =>
  ({
    type: 'FETCH_ORGANIZATIONS_SUCCESS',
    payload,
    numResults
  } as const);

const fetchOrganizationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ORGANIZATIONS_FAILURE',
    error
  } as const;
};

const shouldFetchOrganizations = (state: RootState, search: string) => {
  const {
    autocompleteOrganizations: { searchTerm, isFetching }
  } = state;

  return !isFetching && search !== searchTerm;
};

export const fetchOrganizations = (
  search?: string,
  pageSize?: number
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchOrganizationsRequest());
    search ? (search = escapeSingleQuote(search)) : (search = undefined);
    const params = search && {
      $filter: `contains(tolower(name),'${search.toLowerCase()}')`
    };

    const { data } = await axios.get<{ value: IOrganization[]; '@odata.count': number }>('/api/v3/organizations', {
      params: {
        ...params,
        pageSize,
        $orderby: 'name'
      }
    });
    dispatch(fetchOrganizationsSuccess(data.value, data['@odata.count']));
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
