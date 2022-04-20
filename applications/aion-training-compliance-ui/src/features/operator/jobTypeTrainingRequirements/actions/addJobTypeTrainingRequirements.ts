import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addJobTypeTrainingRequirementsRequest = () =>
  ({
    type: 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const addJobTypeTrainingRequirementsSuccess = (payload: IOperatorJobTypeTrainingRequirement[]) =>
  ({
    type: 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS',
    payload
  } as const);

const addJobTypeTrainingRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE',
    error
  } as const;
};

export const addJobTypeTrainingRequirements = (
  history: History,
  organizationId: string,
  jobTypeId: string,
  values: ITrainingRequirement[]
): ThunkAction<Promise<IOperatorJobTypeTrainingRequirement[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addJobTypeTrainingRequirementsRequest());

      const { data } = await axios.post<IOperatorJobTypeTrainingRequirement[]>(
        `/api/trainingCompliance/v3.01/jobTypes(${jobTypeId})/trainingRequirements`,
        values.map(({ id }) => id)
      );

      dispatch(addJobTypeTrainingRequirementsSuccess(data));
      resolve(data);
      history.push(`/${organizationId}/training-compliance/job-types/${jobTypeId}`);
    } catch (error) {
      dispatch(addJobTypeTrainingRequirementsFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addJobTypeTrainingRequirementsRequest>
  | ReturnType<typeof addJobTypeTrainingRequirementsSuccess>
  | ReturnType<typeof addJobTypeTrainingRequirementsFailure>;
