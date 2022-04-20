import * as types from '../reducers/trainee';
import axios, { AxiosError } from 'axios';
import { ITrainee } from '../interfaces/trainee';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTraineeRequest = () => ({
  type: types.FETCH_TRAINEE_REQUEST as typeof types.FETCH_TRAINEE_REQUEST
});

const fetchTraineeSuccess = (payload: ITrainee) => ({
  type: types.FETCH_TRAINEE_SUCCESS as typeof types.FETCH_TRAINEE_SUCCESS,
  payload
});

const fetchTraineeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: types.FETCH_TRAINEE_FAILURE as typeof types.FETCH_TRAINEE_FAILURE,
    error
  };
};

const shouldFetchTrainee = ({ trainee: { isFetching, trainee } }: RootState, traineeId: string) =>
  !isFetching && (!trainee || trainee.id !== traineeId);

export const fetchTrainee = (
  traineeId: string
): ThunkAction<Promise<ITrainee>, RootState, null, Actions> => dispatch => {
  return new Promise<ITrainee>(async resolve => {
    try {
      dispatch(fetchTraineeRequest());

      const response = await axios.get<ITrainee>(`/api/v2/trainees/${traineeId}`);

      const trainee = response.data;

      dispatch(fetchTraineeSuccess(trainee));
      resolve(trainee);
    } catch (error) {
      dispatch(fetchTraineeFailure(error));
    }
  });
};

export const fetchTraineeIfNeeded = (traineeId: string): ThunkAction<void, RootState, null, Actions> => async (
  dispatch,
  getState
) => {
  if (shouldFetchTrainee(getState(), traineeId)) {
    try {
      await dispatch(fetchTrainee(traineeId));
    } catch (e) {
      return;
    }
  }
};

export type Actions =
  | ReturnType<typeof fetchTraineeRequest>
  | ReturnType<typeof fetchTraineeSuccess>
  | ReturnType<typeof fetchTraineeFailure>;
