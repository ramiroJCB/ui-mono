import * as actionTypes from '../../actionTypes';
import Axios, { AxiosError } from 'axios';
import { RootState } from '../../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { toggleExpandedRow } from './toggleExpandedRow';
import { RootActions } from 'combineActions';

const fetchVerisourceEmployeeDataRequest = (PECId: string) => ({
  type: actionTypes.FETCH_VERISOURCE_EMPLOYEE_REQUEST,
  payload: {
    PECId
  }
});

const fetchVerisourceEmployeeDataSuccess = (PECId: string, employee: IVerisourceEmployee) => {
  return {
    type: actionTypes.FETCH_VERISOURCE_EMPLOYEE_SUCCESS,
    payload: { employee, PECId }
  };
};

const fetchVerisourceEmployeeDataFailure = (PECId: string, error: AxiosError) => {
  sendError(error);
  return {
    type: actionTypes.FETCH_VERISOURCE_EMPLOYEE_FAILURE,
    payload: { error, PECId }
  };
};

export const fetchVerisourceEmployeeData = (
  verisourceId: string,
  PECId: string
): ThunkAction<Promise<IVerisourceEmployee>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchVerisourceEmployeeDataRequest(PECId));
      const { data } = await Axios.get<IVerisourceEmployee>(`/api/v3.00/verisourceEmployees(${verisourceId})`);
      dispatch(fetchVerisourceEmployeeDataSuccess(PECId, { ...data, origin: 'Verisource' }));
      resolve({ ...data, origin: 'Verisource' });
    } catch (error) {
      dispatch(fetchVerisourceEmployeeDataFailure(PECId, error));
      reject(error);
    }
  });
};

export const performToggleAction = (
  employee: IPECEmployee
): ThunkAction<Promise<IVerisourceEmployee> | null, RootState, null, RootActions> => (dispatch, getState) => {
  const {
    rowsData: { [employee.id]: selectedRow }
  } = getState().employeesTable;
  dispatch(toggleExpandedRow(employee.id));
  if (!!selectedRow) {
    return null;
  } else {
    return dispatch(fetchVerisourceEmployeeData(employee.verisourceEmployeeId || '', employee.id));
  }
};

export type Actions =
  | ReturnType<typeof fetchVerisourceEmployeeDataRequest>
  | ReturnType<typeof fetchVerisourceEmployeeDataSuccess>
  | ReturnType<typeof fetchVerisourceEmployeeDataFailure>;
