import * as types from '../reducers/trainee';
import axios, { AxiosError } from 'axios';
import { ITrainee } from '../interfaces/trainee';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addTraineeRequest = () => ({
  type: types.ADD_TRAINEE_REQUEST as typeof types.ADD_TRAINEE_REQUEST
});

const addTraineeSuccess = (payload: ITrainee) => ({
  type: types.ADD_TRAINEE_SUCCESS as typeof types.ADD_TRAINEE_SUCCESS,
  payload
});

const addTraineeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: types.ADD_TRAINEE_FAILURE as typeof types.ADD_TRAINEE_FAILURE,
    error
  };
};

export const addTrainee = (trainee: Partial<ITrainee>): ThunkAction<Promise<ITrainee>, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  const { userInfo } = getState().userInfo;
  return new Promise<ITrainee>(async (resolve, reject) => {
    try {
      dispatch(addTraineeRequest());

      if (userInfo) {
        const response = await axios.post<ITrainee>('/api/v2/trainees', {
          ...trainee,
          userId: userInfo.userId,
          emailAddress: userInfo.emailAddress ? userInfo.emailAddress : userInfo.userName
        });
        const newTrainee = response.data;

        dispatch(addTraineeSuccess(newTrainee));

        window.location.assign('/user');
        resolve(newTrainee);
      } else {
        throw new Error('No userInfo available for logged-in user');
      }
    } catch (error) {
      dispatch(addTraineeFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addTraineeRequest>
  | ReturnType<typeof addTraineeSuccess>
  | ReturnType<typeof addTraineeFailure>;
