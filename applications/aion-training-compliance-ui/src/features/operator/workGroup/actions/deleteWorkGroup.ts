import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteWorkGroupRequest = () =>
  ({
    type: 'DELETE_WORK_GROUP_REQUEST'
  } as const);

const deleteWorkGroupSuccess = () =>
  ({
    type: 'DELETE_WORK_GROUP_SUCCESS'
  } as const);

const deleteWorkGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_WORK_GROUP_FAILURE',
    error
  } as const;
};

export const deleteWorkGroup = (
  history: History,
  organizationId: string,
  workGroupId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteWorkGroupRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/workGroups(${workGroupId})`);

      dispatch(deleteWorkGroupSuccess());
      resolve();
      history.push(`/${organizationId}/training-compliance/work-groups`);
    } catch (error) {
      dispatch(deleteWorkGroupFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteWorkGroupRequest>
  | ReturnType<typeof deleteWorkGroupSuccess>
  | ReturnType<typeof deleteWorkGroupFailure>;
