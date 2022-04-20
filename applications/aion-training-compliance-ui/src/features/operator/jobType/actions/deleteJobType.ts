import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteJobTypeRequest = () =>
  ({
    type: 'DELETE_JOB_TYPE_REQUEST'
  } as const);

const deleteJobTypeSuccess = () =>
  ({
    type: 'DELETE_JOB_TYPE_SUCCESS'
  } as const);

const deleteJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_JOB_TYPE_FAILURE',
    error
  } as const;
};

export const deleteJobType = (
  history: History,
  organizationId: string,
  jobTypeId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteJobTypeRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/jobTypes(${jobTypeId})`);

      dispatch(deleteJobTypeSuccess());
      resolve();
      history.push(`/${organizationId}/training-compliance/job-types`);
    } catch (error) {
      dispatch(deleteJobTypeFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteJobTypeRequest>
  | ReturnType<typeof deleteJobTypeSuccess>
  | ReturnType<typeof deleteJobTypeFailure>;
