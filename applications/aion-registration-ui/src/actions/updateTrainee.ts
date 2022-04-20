import * as types from '../reducers/trainee';
import axios, { AxiosError } from 'axios';
import { ITrainee } from '../interfaces/trainee';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateTraineeRequest = () => ({
  type: types.UPDATE_TRAINEE_REQUEST as typeof types.UPDATE_TRAINEE_REQUEST
});

const updateTraineeSuccess = (payload: ITrainee) => ({
  type: types.UPDATE_TRAINEE_SUCCESS as typeof types.UPDATE_TRAINEE_SUCCESS,
  payload
});

const updateTraineeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: types.UPDATE_TRAINEE_FAILURE as typeof types.UPDATE_TRAINEE_FAILURE,
    error
  };
};

export const updateTrainee = (trainee: ITrainee): ThunkAction<Promise<ITrainee>, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  const { userInfo } = getState().userInfo;
  return new Promise<ITrainee>(async (resolve, reject) => {
    try {
      dispatch(updateTraineeRequest());

      if (userInfo) {
        const response = await axios.put<ITrainee>(`/api/v2/trainees/${trainee.id}`, {
          ...trainee,
          userId: userInfo.userId
        });
        const updatedTrainee = response.data;

        dispatch(updateTraineeSuccess(updatedTrainee));

        window.location.assign('/user');
        resolve(updatedTrainee);
      } else {
        throw new Error('No userInfo available for logged-in user');
      }
    } catch (error) {
      dispatch(updateTraineeFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateTraineeRequest>
  | ReturnType<typeof updateTraineeSuccess>
  | ReturnType<typeof updateTraineeFailure>;
