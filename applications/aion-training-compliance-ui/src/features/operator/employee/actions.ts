import axios, { AxiosError } from 'axios';
import { IEmployee } from 'interfaces/employee';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchEmployeeRequest = () =>
  ({
    type: 'FETCH_EMPLOYEE_REQUEST'
  } as const);

const fetchEmployeeSuccess = (payload: IEmployee) =>
  ({
    type: 'FETCH_EMPLOYEE_SUCCESS',
    payload
  } as const);

const fetchEmployeeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_EMPLOYEE_FAILURE',
    error
  } as const;
};

export const fetchEmployee = (
  employeeId: string
): ThunkAction<Promise<IEmployee>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchEmployeeRequest());

      const { data } = await axios.get<IEmployee>(`/api/trainingCompliance/v3.01/employees(${employeeId})`);

      dispatch(fetchEmployeeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchEmployeeFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchEmployeeRequest>
  | ReturnType<typeof fetchEmployeeSuccess>
  | ReturnType<typeof fetchEmployeeFailure>;
