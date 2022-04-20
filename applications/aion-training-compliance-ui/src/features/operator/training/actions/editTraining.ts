import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const editTrainingRequest = () =>
  ({
    type: 'EDIT_TRAINING_REQUEST'
  } as const);

const editTrainingSuccess = (payload: ITrainingRequirement) =>
  ({
    type: 'EDIT_TRAINING_SUCCESS',
    payload
  } as const);

const editTrainingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_TRAINING_FAILURE',
    error
  } as const;
};

export const editTraining = (
  trainingRequirementId: string,
  values: ITrainingRequirement
): ThunkAction<Promise<ITrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editTrainingRequest());

      const { data } = await axios.put<ITrainingRequirement>(
        `/api/trainingCompliance/v3.01/trainingRequirements(${trainingRequirementId})`,
        values
      );

      dispatch(editTrainingSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editTrainingFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editTrainingRequest>
  | ReturnType<typeof editTrainingSuccess>
  | ReturnType<typeof editTrainingFailure>;
