import axios, { AxiosError } from 'axios';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTrainingClassRequest = () =>
  ({
    type: 'FETCH_TRAINING_CLASS_REQUEST'
  } as const);

const fetchTrainingClassSuccess = (payload: ITrainingClass) =>
  ({
    type: 'FETCH_TRAINING_CLASS_SUCCESS',
    payload
  } as const);

const fetchTrainingClassFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAINING_CLASS_FAILURE',
    error
  } as const;
};

export const fetchTrainingClass = (id: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTrainingClassRequest());

    const params = { $filter: `id eq ${id}` };

    const {
      data: { value }
    } = await axios.get<{ '@odata.count': number; value: ITrainingClass }>('/api/v3.00/classes', {
      params
    });

    dispatch(fetchTrainingClassSuccess(value[0]));
  } catch (error) {
    dispatch(fetchTrainingClassFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchTrainingClassRequest>
  | ReturnType<typeof fetchTrainingClassSuccess>
  | ReturnType<typeof fetchTrainingClassFailure>;
