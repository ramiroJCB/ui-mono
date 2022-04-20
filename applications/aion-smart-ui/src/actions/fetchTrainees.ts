import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { SubmissionError } from 'redux-form';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const fetchTraineesRequest = () =>
  ({
    type: 'FETCH_TRAINEES_REQUEST'
  } as const);

const fetchTraineesSuccess = (payload: ITraineeWithEmployees[], pecIdentifier: string) =>
  ({
    type: 'FETCH_TRAINEES_SUCCESS',
    payload,
    pecIdentifier
  } as const);

const fetchTraineesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAINEES_FAILURE',
    error
  } as const;
};

export const fetchTrainees = (
  pecIdentifier: string,
  history: History
): ThunkAction<Promise<ITraineeWithEmployees[]>, RootState, null, Actions> => dispatch => {
  return new Promise<ITraineeWithEmployees[]>(async (resolve, reject) => {
    try {
      dispatch(fetchTraineesRequest());

      const $filter = `pecIdentifier eq '${pecIdentifier}'`;
      const include = 'employees';

      const response = await axios.get<{ value: ITraineeWithEmployees[]; '@odata.count': number }>('/spapi/trainees', {
        params: { $filter, include }
      });

      const trainees = response.data.value || response.data; // API || json-server

      if (trainees.length === 0) {
        throw new Error(`No records with pecIdentifier "${pecIdentifier}" were found.`);
      } else {
        dispatch(fetchTraineesSuccess(trainees, pecIdentifier));

        history.push({
          state: { showPecIdMatches: true }
        });

        resolve(trainees);
      }
    } catch (error) {
      dispatch(fetchTraineesFailure(error));
      reject(
        new SubmissionError({
          _error: i18next.t('smart.fetchTrainee.workerNotFound', 'Worker not found. Please try again.')
        })
      );
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchTraineesRequest>
  | ReturnType<typeof fetchTraineesSuccess>
  | ReturnType<typeof fetchTraineesFailure>;
