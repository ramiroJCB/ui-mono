import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const unassignWorkGroupJobTypeRequest = () =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_REQUEST'
  } as const);

const unassignWorkGroupJobTypeSuccess = () =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_SUCCESS'
  } as const);

const unassignWorkGroupJobTypeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_FAILURE',
    error
  } as const;
};

export const unassignWorkGroupJobType = (
  history: History,
  organizationId: string,
  workGroupId: string,
  workGroupJobTypeId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(unassignWorkGroupJobTypeRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/workGroupJobTypes(${workGroupJobTypeId})`);

      dispatch(unassignWorkGroupJobTypeSuccess());
      resolve();
      history.push(`/${organizationId}/training-compliance/work-groups/${workGroupId}`);
    } catch (error) {
      dispatch(unassignWorkGroupJobTypeFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof unassignWorkGroupJobTypeRequest>
  | ReturnType<typeof unassignWorkGroupJobTypeSuccess>
  | ReturnType<typeof unassignWorkGroupJobTypeFailure>;
