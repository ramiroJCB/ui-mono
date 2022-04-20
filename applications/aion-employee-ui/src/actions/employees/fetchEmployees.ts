import * as actionTypes from '../../actionTypes';
import Axios, { AxiosError } from 'axios';
import { RootState } from '../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { ParsedUrlQuery } from 'querystring';

const shouldFetchTableData = ({ PECEmployees: { isFetching } }: RootState) => !isFetching;

const fetchTableDataRequest = () => ({
  type: actionTypes.FETCH_EMPLOYEES_REQUEST
});

const fetchTableDataSuccess = ({ value, '@odata.count': count }: { value: IPECEmployee[]; '@odata.count': number }) => {
  return {
    type: actionTypes.FETCH_EMPLOYEES_SUCCESS,
    payload: { value, count }
  };
};

const fetchTableDataFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: actionTypes.FETCH_EMPLOYEES_FAILURE,
    error
  };
};

const applyOrder = (orderBy: string | undefined, order: string) => orderBy && `${orderBy} ${order}`;

export const fetchTableData = (
  params: ParsedUrlQuery,
  organizationId: string,
  fetchLinkedOnly?: boolean
): ThunkAction<Promise<IPECEmployee[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTableDataRequest());
      const { data } = await Axios.get<{ value: IPECEmployee[]; '@odata.count': number }>('/api/v3.00/employees', {
        params: {
          $count: true,
          $orderby: applyOrder(params.PECOrderBy as string, params.PECOrder as string),
          $skip:
            (params.PECPageNumber ? parseInt(params.PECPageNumber as string) : 0) *
            (params.rowsPerPage ? parseInt(params.rowsPerPage as string) : 15),
          $top: params.rowsPerPage ? parseInt(params.rowsPerPage as string) : 15,
          $filter: `(OrganizationId eq ${organizationId}) and (verisourceEmployeeId ${
            !!fetchLinkedOnly ? 'ne' : 'eq'
          } null)`,
          search: params.PECSearch as string
        }
      });
      dispatch(fetchTableDataSuccess(data));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchTableDataFailure(error));
      reject(error);
    }
  });
};

export const fetchTableDataIfNeeded = (
  params: ParsedUrlQuery,
  organizationId: string,
  fetchLinkedOnly?: boolean
): ThunkAction<Promise<IPECEmployee[]>, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTableData(getState())) {
    return dispatch(fetchTableData(params, organizationId, fetchLinkedOnly));
  } else {
    return Promise.reject();
  }
};

export type Actions =
  | ReturnType<typeof fetchTableDataSuccess>
  | ReturnType<typeof fetchTableDataRequest>
  | ReturnType<typeof fetchTableDataFailure>;
