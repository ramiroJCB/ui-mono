import * as types from '../reducers/trainees';
import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { ITrainee } from '../interfaces/trainee';
import { RootState } from '../combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { SubmissionError } from 'redux-form';
import { ThunkAction } from 'redux-thunk';

export const fetchTraineesRequest = () => ({
  type: types.FETCH_TRAINEES_REQUEST as typeof types.FETCH_TRAINEES_REQUEST
});

export const fetchTraineesSuccess = (payload: ITrainee[], lastFetchedPecId: string | null) => ({
  type: types.FETCH_TRAINEES_SUCCESS as typeof types.FETCH_TRAINEES_SUCCESS,
  payload,
  lastFetchedPecId
});

export const fetchTraineesFailure = (error: AxiosError, lastFetchedPecId: string | null) => {
  sendError(error);
  return {
    type: types.FETCH_TRAINEES_FAILURE as typeof types.FETCH_TRAINEES_FAILURE,
    error,
    lastFetchedPecId
  };
};

const shouldFetchTrainees = ({ trainees: { isFetching, trainees } }: RootState) => !isFetching && !trainees;

export const fetchTrainees = (
  pecIdentifier: string,
  history: History
): ThunkAction<Promise<ITrainee[]>, RootState, null, Actions> => dispatch => {
  return new Promise<ITrainee[]>(async (resolve, reject) => {
    try {
      dispatch(fetchTraineesRequest());

      const response = await axios.get<ITrainee[]>('/api/v2/trainees', {
        params: { pecIdentifier }
      });

      const trainees = response.data;
      const unregisteredTrainees = trainees.filter(t => t.userId === null);

      if (trainees.length === 0) {
        throw new Error('No trainees found');
      }

      dispatch(fetchTraineesSuccess(unregisteredTrainees, pecIdentifier));

      switch (unregisteredTrainees.length) {
        case 0:
          history.push('/using-a-company');
          break;
        case 1:
          history.push(`/trainees/${unregisteredTrainees[0].id}`, { state: { hasMultipleResults: false } });
          break;
        default:
          history.push({
            state: { hasMultipleResults: true }
          });
      }

      resolve(unregisteredTrainees);
    } catch (error) {
      dispatch(fetchTraineesFailure(error, pecIdentifier));
      reject(new SubmissionError({ _error: `No trainees with pecIdentifier "${pecIdentifier}" were found.` }));
    }
  });
};

export const fetchTraineesIfNeeded = (
  pecIdentifier: string,
  history: History
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchTrainees(getState())) {
    try {
      await dispatch(fetchTrainees(pecIdentifier, history));
    } catch (e) {
      return;
    }
  }
};

export type Actions =
  | ReturnType<typeof fetchTraineesRequest>
  | ReturnType<typeof fetchTraineesSuccess>
  | ReturnType<typeof fetchTraineesFailure>;
