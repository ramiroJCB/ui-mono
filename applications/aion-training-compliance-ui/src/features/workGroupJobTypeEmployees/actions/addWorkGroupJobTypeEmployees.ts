import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IEmployee } from 'interfaces/employee';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addWorkGroupJobTypeEmployeesRequest = () =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST'
  } as const);

const addWorkGroupJobTypeEmployeesSuccess = (payload: IWorkGroupJobTypeEmployee[]) =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_SUCCESS',
    payload
  } as const);

const addWorkGroupJobTypeEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_FAILURE',
    error
  } as const;
};

export const addWorkGroupJobTypeEmployees = (
  history: History,
  organizationId: string,
  clientId: string,
  workGroupId: string,
  workGroupJobTypeId: string,
  values: IEmployee[]
): ThunkAction<Promise<IWorkGroupJobTypeEmployee[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addWorkGroupJobTypeEmployeesRequest());

      const { data } = await axios.post<IWorkGroupJobTypeEmployee[]>(
        `/api/trainingCompliance/v3.01/workGroupJobTypes(${workGroupJobTypeId})/employees`,
        values.map(({ id }) => id)
      );

      dispatch(addWorkGroupJobTypeEmployeesSuccess(data));
      resolve(data);
      history.push(
        `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`
      );
    } catch (error) {
      dispatch(addWorkGroupJobTypeEmployeesFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof addWorkGroupJobTypeEmployeesRequest>
  | ReturnType<typeof addWorkGroupJobTypeEmployeesSuccess>
  | ReturnType<typeof addWorkGroupJobTypeEmployeesFailure>;
