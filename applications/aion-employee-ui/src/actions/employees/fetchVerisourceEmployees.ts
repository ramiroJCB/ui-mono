import * as actionTypes from '../../actionTypes';
import Axios, { AxiosError } from 'axios';
import { RootState } from '../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { ParsedUrlQuery } from 'querystring';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { format } from 'date-fns';

const shouldFetchTableData = ({ VerisourceEmployees: { isFetching } }: RootState) => !isFetching;

const fetchTableDataRequest = () => ({
  type: actionTypes.FETCH_VERISOURCE_EMPLOYEES_REQUEST
});

const fetchTableDataSuccess = (values: IVerisourceEmployee[], count: number) => {
  return {
    type: actionTypes.FETCH_VERISOURCE_EMPLOYEES_SUCCESS,
    payload: { values, count }
  };
};

const fetchTableDataFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: actionTypes.FETCH_VERISOURCE_EMPLOYEES_FAILURE,
    error
  };
};

const applyOrder = (orderBy: string | undefined, order: string) => orderBy && `${orderBy} ${order}`;

export const fetchTableData = (
  params: ParsedUrlQuery
): ThunkAction<Promise<IVerisourceEmployee[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!!(params.VerisourceSearch as string)) {
        dispatch(fetchTableDataRequest());
        const {
          data: { values, count }
        } = await Axios.get<{ values: IVerisourceEmployee[]; count: number }>('/api/v3.00/verisourceEmployees/search', {
          params: {
            orderby: applyOrder(params.VerisourceOrderBy as string, params.VerisourceOrder as string),
            offset:
              (params.VerisourcePageNumber ? parseInt(params.VerisourcePageNumber as string) : 0) *
              (params.rowsPerPage ? parseInt(params.rowsPerPage as string) : 15),
            limit: params.rowsPerPage ? parseInt(params.rowsPerPage as string) : 15,
            search: params.VerisourceSearch as string
          }
        });
        const newValues: IVerisourceEmployee[] = values.map(e => ({ ...e, id: `${e.oqsgId}` }));
        dispatch(fetchTableDataSuccess(newValues, count));
        resolve(newValues);
      }
    } catch (error) {
      dispatch(fetchTableDataFailure(error));
      reject(error);
    }
  });
};

export const fetchTableDataItemSelected = (
  pecEmployee: IPECEmployee
): ThunkAction<Promise<IVerisourceEmployee[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTableDataRequest());
      const {
        data: { values, count }
      } = await Axios.post<{ values: IVerisourceEmployee[]; count: number }>(
        '/api/v3.00/verisourceEmployees/smartSearch',
        {
          firstName: pecEmployee.traineeFirstName,
          lastName: pecEmployee.traineeLastName,
          birthDate: format(pecEmployee.traineeBirthDate, 'YYYY-MM-DD')
        }
      );
      const newValues: IVerisourceEmployee[] = values.map(e => ({ ...e, id: `${e.oqsgId}` }));
      dispatch(fetchTableDataSuccess(newValues, count));
      resolve(newValues);
    } catch (error) {
      dispatch(fetchTableDataFailure(error));
      reject(error);
    }
  });
};

export const fetchTableDataIfNeeded = (params: ParsedUrlQuery): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchTableData(getState())) {
    dispatch(fetchTableData(params));
  }
};

export const fetchTableDataItemSelectedIfNeeded = (
  params: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTableData(getState())) {
    const itemSelected = getState().PECEmployees.employees.find(({ id }) => id === params.ItemSelected);
    if (itemSelected !== undefined) dispatch(fetchTableDataItemSelected(itemSelected));
  }
};

export type Actions =
  | ReturnType<typeof fetchTableDataSuccess>
  | ReturnType<typeof fetchTableDataRequest>
  | ReturnType<typeof fetchTableDataFailure>;
