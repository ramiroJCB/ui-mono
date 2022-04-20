import * as actionTypes from '../../actionTypes';
import Axios, { AxiosError } from 'axios';
import { RootState } from '../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { NotistackSnackbar } from '@pec/aion-ui-core/interfaces/notistackSnackbar';
import i18next from 'i18next';

const shouldMakeRequest = ({ employeeLinking: { isFetching } }: RootState) => !isFetching;

const linkEmployeesRequest = () => ({
  type: actionTypes.LINK_EMPLOYEES_REQUEST
});

const linkEmployeesSuccess = ({ value }: { value: IPECEmployee }) => {
  return {
    type: actionTypes.LINK_EMPLOYEES_SUCCESS,
    payload: { value }
  };
};

const requestSuccess = ({ value }: { value: IPECEmployee }) => {
  return {
    type: actionTypes.LINK_EMPLOYEES_SUCCESS,
    payload: { value }
  };
};

const linkEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: actionTypes.LINK_EMPLOYEES_FAILURE,
    error
  };
};

const errorSnackBarMessage = ({ response }: AxiosError) => {
  switch (response && response.data.key) {
    case 'OBJECT_VALIDATION_ERROR':
      return i18next.t(
        'employee.linkEmployee.thisEmployeeIsAlreadyLinked',
        'This employee is already linked. Choose a different employee.'
      );
    default:
      return i18next.t('employee.linkEmployee.thereWasAProblem', 'There was a problem linking the employees.');
  }
};

export const linkEmployees = (
  PECEmployeeId: string,
  verisourceId: number
): ThunkAction<Promise<IPECEmployee>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(linkEmployeesRequest());
      const { data } = await Axios.patch<{ value: IPECEmployee }>(`/api/v3.00/employees(${PECEmployeeId})`, [
        { op: 'replace', path: '/verisourceEmployeeId', value: verisourceId }
      ]);
      dispatch(linkEmployeesSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('employee.linkEmployee.employeesSuccessfullyLinked', 'Employees Successfully linked.'),
          options: {
            variant: 'success'
          }
        } as NotistackSnackbar)
      );
      resolve(data.value);
    } catch (error) {
      dispatch(linkEmployeesFailure(error));
      dispatch(
        enqueueSnackbar({
          message: errorSnackBarMessage(error),
          options: {
            variant: 'error'
          }
        } as NotistackSnackbar)
      );
      reject(error);
    }
  });
};

export const unlinkEmployees = (
  PECEmployeeId: string
): ThunkAction<Promise<IPECEmployee>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(linkEmployeesRequest());
      const { data } = await Axios.patch<{ value: IPECEmployee }>(`/api/v3.00/employees(${PECEmployeeId})`, [
        { op: 'replace', path: '/verisourceEmployeeId', value: null }
      ]);
      dispatch(requestSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('employee.linkEmployee.employeesSuccessfullyUnlinked', 'Employees Successfully unlinked.'),
          options: {
            variant: 'success'
          }
        } as NotistackSnackbar)
      );
      resolve(data.value);
    } catch (error) {
      dispatch(linkEmployeesFailure(error));
      dispatch(
        enqueueSnackbar({
          message: errorSnackBarMessage(error),
          options: {
            variant: 'error'
          }
        } as NotistackSnackbar)
      );
      reject(error);
    }
  });
};

export const linkEmployeesIfNeeded = (
  PECEmployeeId: string,
  verisourceId: number
): ThunkAction<Promise<IPECEmployee>, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldMakeRequest(getState())) {
    return dispatch(linkEmployees(PECEmployeeId, verisourceId));
  } else {
    return Promise.reject();
  }
};

export const unlinkEmployeesIfNeeded = (
  PECEmployeeId: string
): ThunkAction<Promise<IPECEmployee>, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldMakeRequest(getState())) {
    return dispatch(unlinkEmployees(PECEmployeeId));
  } else {
    return Promise.reject();
  }
};

export type Actions =
  | ReturnType<typeof linkEmployeesRequest>
  | ReturnType<typeof linkEmployeesSuccess>
  | ReturnType<typeof linkEmployeesFailure>;
