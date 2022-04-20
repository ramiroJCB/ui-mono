import axios, { AxiosError } from 'axios';
import { addJobTypeTrainingRequirements } from 'features/operator/jobTypeTrainingRequirements/actions/addJobTypeTrainingRequirements';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IAddJobTypeForm } from 'interfaces/addJobTypeForm';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addJobTypeRequest = () =>
  ({
    type: 'ADD_JOB_TYPE_REQUEST'
  } as const);

const addJobTypeSuccess = (payload: IJobType) =>
  ({
    type: 'ADD_JOB_TYPE_SUCCESS',
    payload
  } as const);

const addJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_JOB_TYPE_FAILURE',
    error
  } as const;
};

export const addJobType = (
  history: History,
  organizationId: string,
  values: IAddJobTypeForm
): ThunkAction<Promise<IJobType>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addJobTypeRequest());
      const { trainings, ...addJobType } = values;
      const { data } = await axios.post<IJobType>('/api/trainingCompliance/v3.01/jobTypes', addJobType);

      trainings &&
        trainings.length &&
        (await dispatch(addJobTypeTrainingRequirements(history, organizationId, data.id, trainings)));

      dispatch(addJobTypeSuccess(data));
      resolve(data);
      history.push(`/${organizationId}/training-compliance/job-types/${data.id}`);
    } catch (error) {
      dispatch(addJobTypeFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addJobTypeRequest>
  | ReturnType<typeof addJobTypeSuccess>
  | ReturnType<typeof addJobTypeFailure>;
