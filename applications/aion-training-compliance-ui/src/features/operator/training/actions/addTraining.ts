import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IAddTrainingForm } from 'interfaces/addTrainingForm';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addTrainingRequest = () =>
  ({
    type: 'ADD_TRAINING_REQUEST'
  } as const);

const addTrainingSuccess = (payload: ITrainingRequirement) =>
  ({
    type: 'ADD_TRAINING_SUCCESS',
    payload
  } as const);

const addTrainingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_TRAINING_FAILURE',
    error
  } as const;
};

export const addTraining = (
  history: History,
  organizationId: string,
  values: IAddTrainingForm
): ThunkAction<Promise<ITrainingRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addTrainingRequest());

      const { data } = await axios.post<ITrainingRequirement>(
        '/api/trainingCompliance/v3.01/trainingRequirements',
        values
      );

      dispatch(addTrainingSuccess(data));
      resolve(data);

      history.push(`/${organizationId}/training-compliance/training/${data.id}/general-info`);
    } catch (error) {
      dispatch(addTrainingFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addTrainingRequest>
  | ReturnType<typeof addTrainingSuccess>
  | ReturnType<typeof addTrainingFailure>;
