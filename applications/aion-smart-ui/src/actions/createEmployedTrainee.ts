import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { IEmployedTrainee } from 'interfaces/employedTrainee';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const createEmployedTraineeRequest = () =>
  ({
    type: 'CREATE_EMPLOYED_TRAINEE_REQUEST'
  } as const);

export const createEmployedTraineeSuccess = (payload: ITraineeWithEmployees) =>
  ({
    type: 'CREATE_EMPLOYED_TRAINEE_SUCCESS',
    payload
  } as const);

export const createEmployedTraineeFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'CREATE_EMPLOYED_TRAINEE_FAILURE',
    error
  } as const;
};

export const createEmployedTrainee = (
  employedTrainee: IEmployedTrainee,
  history: History,
  organizationId: string,
  siteId: string
): ThunkAction<Promise<ITraineeWithEmployees>, RootState, null, Actions> => dispatch => {
  return new Promise<ITraineeWithEmployees>(async (resolve, reject) => {
    try {
      dispatch(createEmployedTraineeRequest());

      const response = await axios.post<ITraineeWithEmployees>('/api/v2/create/employedTrainees', employedTrainee);
      const newEmployedTrainee = response.data;

      if (!newEmployedTrainee) {
        throw new Error('Unable to create new employedTrainee record');
      }

      dispatch(createEmployedTraineeSuccess(newEmployedTrainee));

      history.push(`/${organizationId}/sites/${siteId}/workers/${newEmployedTrainee.employees[0].id}`);

      resolve(newEmployedTrainee);
    } catch (error) {
      dispatch(createEmployedTraineeFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof createEmployedTraineeRequest>
  | ReturnType<typeof createEmployedTraineeSuccess>
  | ReturnType<typeof createEmployedTraineeFailure>;
