import axios, { AxiosError } from 'axios';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { IOrganizatonResult } from 'interfaces/organizations';

export const fetchOrganizationsRequest = () =>
  ({
    type: 'FETCH_ORGANIZATIONS_REQUEST'
  } as const);

export const fetchOrganizationsSuccess = (
  payload: IOrganizatonResult[],
  search: string,
  page: string,
  pageSize: number,
  totalCount: number
) =>
  ({
    type: 'FETCH_ORGANIZATIONS_SUCCESS',
    payload,
    search,
    page,
    pageSize,
    totalCount
  } as const);

export const fetchOrganizationsFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_ORGANIZATIONS_FAILURE',
    error
  } as const;
};

const shouldFetchOrganizations = (state: RootState, search: string, page: string) => {
  const {
    organizations: { searchTerm, currentPage }
  } = state;

  return search !== searchTerm || page !== currentPage;
};

const fetchOrganizations = (
  search: string,
  top: number = 0,
  page: string = '1'
): ThunkAction<Promise<IOrganizatonResult[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchOrganizationsRequest());

      const skip = page === '1' ? 0 : (+page - 1) * top;
      const { Contains } = OdataComparator;
      const params = new QueryBuilder()
        .skip(skip)
        .top(top)
        .filter(({ filterBy }) =>
          filterBy('name', Contains, search.toLowerCase()).or(filter =>
            filter.filterBy('veriforceOrganizationName', Contains, search.toLowerCase())
          )
        )
        .toQueryParam();

      const response = await axios.get<{ value: IOrganizatonResult[]; '@odata.count': number }>(
        '/api/v3.00/organizations',
        {
          params
        }
      );

      const organizations = response.data.value;
      const totalCount = response.data['@odata.count'];

      dispatch(fetchOrganizationsSuccess(organizations, search, page, top, totalCount));
      resolve(organizations);
    } catch (error) {
      dispatch(fetchOrganizationsFailure(error));
      reject();
    }
  });

export const fetchOrganizationsIfNeeded = (
  search: string,
  page: string = '1',
  pageSize: number = 10
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchOrganizations(getState(), search, page)) {
    dispatch(fetchOrganizations(search, pageSize, page));
  }
};

export type Actions =
  | ReturnType<typeof fetchOrganizationsRequest>
  | ReturnType<typeof fetchOrganizationsSuccess>
  | ReturnType<typeof fetchOrganizationsFailure>;
