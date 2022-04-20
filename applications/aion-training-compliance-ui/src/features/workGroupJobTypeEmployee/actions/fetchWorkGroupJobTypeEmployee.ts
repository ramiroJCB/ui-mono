import axios, { AxiosError } from 'axios';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkGroupJobTypeEmployeeRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_REQUEST'
  } as const);

const fetchWorkGroupJobTypeEmployeeSuccess = (payload: IWorkGroupJobTypeEmployee) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_SUCCESS',
    payload
  } as const);

const fetchWorkGroupJobTypeEmployeeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_FAILURE',
    error
  } as const;
};

const shouldFetchWorkGroupJobTypeEmployee = (
  workGroupJobTypeEmployeeId: string,
  { workGroupJobTypeEmployee: { isFetching, workGroupJobTypeEmployee } }: RootState
) =>
  (!workGroupJobTypeEmployee && !isFetching) ||
  (workGroupJobTypeEmployee && workGroupJobTypeEmployeeId !== workGroupJobTypeEmployee.id);

const fetchWorkGroupJobTypeEmployee = (
  workGroupJobTypeEmployeeId: string
): ThunkAction<Promise<IWorkGroupJobTypeEmployee>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupJobTypeEmployeeRequest());

      const params = new QueryBuilder().expand('employee').toQueryParam();
      const { data } = await axios.get<IWorkGroupJobTypeEmployee>(
        `/api/trainingCompliance/v3.01/workGroupJobTypeEmployees(${workGroupJobTypeEmployeeId})`,
        { params }
      );

      dispatch(fetchWorkGroupJobTypeEmployeeSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeEmployeeFailure(error));
      reject();
    }
  });

export const fetchWorkGroupJobTypeEmployeeIfNeeded = (
  workGroupJobTypeEmployeeId: string
): ThunkAction<Promise<IWorkGroupJobTypeEmployee>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    try {
      if (shouldFetchWorkGroupJobTypeEmployee(workGroupJobTypeEmployeeId, getState())) {
        const data = await dispatch(fetchWorkGroupJobTypeEmployee(workGroupJobTypeEmployeeId));
        resolve(data);
      } else {
        const { workGroupJobTypeEmployee } = getState().workGroupJobTypeEmployee;
        workGroupJobTypeEmployee && resolve(workGroupJobTypeEmployee);
      }
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeEmployeeFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeeFailure>;
