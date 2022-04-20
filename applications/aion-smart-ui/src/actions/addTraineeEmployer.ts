import axios, { AxiosError } from 'axios';
import { formatTraineeWithNewEmployer } from 'helpers/formatTrainee';
import { IChangeEmployerForm } from 'interfaces/changeEmployerForm';
import { IEmployeeRecord } from 'interfaces/employeeRecord';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addTraineeEmployerRequest = () =>
  ({
    type: 'ADD_TRAINEE_EMPLOYER_REQUEST'
  } as const);

export const addTraineeEmployerSuccess = (payload: IEmployeeRecord, orgName: string) =>
  ({
    type: 'ADD_TRAINEE_EMPLOYER_SUCCESS',
    payload,
    orgName
  } as const);

export const addTraineeEmployerFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'ADD_TRAINEE_EMPLOYER_FAILURE',
    error
  } as const;
};

export const addTraineeEmployer = (
  changeEmployerForm: IChangeEmployerForm,
  traineeId: string
): ThunkAction<Promise<IEmployeeRecord>, RootState, null, Actions> => dispatch => {
  return new Promise<IEmployeeRecord>(async (resolve, reject) => {
    try {
      dispatch(addTraineeEmployerRequest());
      const traineeWithNewEmployer = formatTraineeWithNewEmployer(changeEmployerForm, traineeId);
      const orgName = traineeWithNewEmployer.organizationName;

      const response = await axios.post<IEmployeeRecord>('/api/v2/create/employeeRecords', traineeWithNewEmployer);
      const newEmployee = response.data;

      if (!newEmployee) {
        throw new Error('Unable to create new employment record for this trainee');
      }

      dispatch(addTraineeEmployerSuccess(newEmployee, orgName));

      resolve(newEmployee);
    } catch (error) {
      dispatch(addTraineeEmployerFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addTraineeEmployerRequest>
  | ReturnType<typeof addTraineeEmployerSuccess>
  | ReturnType<typeof addTraineeEmployerFailure>;
