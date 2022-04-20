import axios, { AxiosError } from 'axios';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTrainingRequest = () =>
  ({
    type: 'FETCH_TRAINING_REQUEST'
  } as const);

const fetchTrainingSuccess = (payload: ITrainingRequirement) =>
  ({
    type: 'FETCH_TRAINING_SUCCESS',
    payload
  } as const);

const fetchTrainingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAINING_FAILURE',
    error
  } as const;
};

const shouldFetchTraining = (trainingRequirementId: string, { training: { isFetching, training } }: RootState) =>
  (!training && !isFetching) || (training && trainingRequirementId !== training.id);

const fetchTraining = (
  trainingRequirementId: string
): ThunkAction<Promise<ITrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTrainingRequest());

      const { data } = await axios.get<ITrainingRequirement>(
        `/api/trainingCompliance/v3.01/trainingRequirements(${trainingRequirementId})`
      );

      dispatch(fetchTrainingSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchTrainingFailure(error));
      reject(error);
    }
  });

export const fetchTrainingIfNeeded = (trainingRequirementId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchTraining(trainingRequirementId, getState())) {
    dispatch(fetchTraining(trainingRequirementId));
  }
};

export type Actions =
  | ReturnType<typeof fetchTrainingRequest>
  | ReturnType<typeof fetchTrainingSuccess>
  | ReturnType<typeof fetchTrainingFailure>;
