import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteTrainingRequest = () =>
  ({
    type: 'DELETE_TRAINING_REQUEST'
  } as const);

const deleteTrainingSuccess = () =>
  ({
    type: 'DELETE_TRAINING_SUCCESS'
  } as const);

const deleteTrainingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_TRAINING_FAILURE',
    error
  } as const;
};

export const deleteTraining = (
  history: History,
  organizationId: string,
  trainingRequirementId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteTrainingRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/trainingRequirements(${trainingRequirementId})`);

      dispatch(deleteTrainingSuccess());
      resolve();
      history.push(`/${organizationId}/training-compliance/training`);
    } catch (error) {
      dispatch(deleteTrainingFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteTrainingRequest>
  | ReturnType<typeof deleteTrainingSuccess>
  | ReturnType<typeof deleteTrainingFailure>;
