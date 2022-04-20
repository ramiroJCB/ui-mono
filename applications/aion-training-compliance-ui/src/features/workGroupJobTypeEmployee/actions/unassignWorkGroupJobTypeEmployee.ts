import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const unassignWorkGroupJobTypeEmployeeRequest = () =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_REQUEST'
  } as const);

const unassignWorkGroupJobTypeEmployeeSuccess = (payload: string) =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_SUCCESS',
    payload
  } as const);

const unassignWorkGroupJobTypeEmployeeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_FAILURE',
    error
  } as const;
};

export const unassignWorkGroupJobTypeEmployee = (
  workGroupJobTypeEmployeeId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(unassignWorkGroupJobTypeEmployeeRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/workGroupJobTypeEmployees(${workGroupJobTypeEmployeeId})`);

      dispatch(unassignWorkGroupJobTypeEmployeeSuccess(workGroupJobTypeEmployeeId));
      resolve();
    } catch (error) {
      dispatch(unassignWorkGroupJobTypeEmployeeFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof unassignWorkGroupJobTypeEmployeeRequest>
  | ReturnType<typeof unassignWorkGroupJobTypeEmployeeSuccess>
  | ReturnType<typeof unassignWorkGroupJobTypeEmployeeFailure>;
