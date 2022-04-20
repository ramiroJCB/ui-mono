import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteJobTypeTrainingRequirementRequest = () =>
  ({
    type: 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_REQUEST'
  } as const);

const deleteJobTypeTrainingRequirementSuccess = () =>
  ({
    type: 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS'
  } as const);

const deleteJobTypeTrainingRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE',
    error
  } as const;
};

export const deleteJobTypeTrainingRequirement = (
  history: History,
  organizationId: string,
  jobTypeId: string,
  jobTypeTrainingRequirementId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteJobTypeTrainingRequirementRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/jobTypeTrainingRequirements(${jobTypeTrainingRequirementId})`);

      dispatch(deleteJobTypeTrainingRequirementSuccess());
      resolve();
      history.push(`/${organizationId}/training-compliance/job-types/${jobTypeId}`);
    } catch (error) {
      dispatch(deleteJobTypeTrainingRequirementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteJobTypeTrainingRequirementRequest>
  | ReturnType<typeof deleteJobTypeTrainingRequirementSuccess>
  | ReturnType<typeof deleteJobTypeTrainingRequirementFailure>;
