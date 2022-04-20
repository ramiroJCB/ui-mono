import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteTaskGroupRequest = () =>
  ({
    type: 'DELETE_TASK_GROUP_REQUEST'
  } as const);

const deleteTaskGroupSuccess = () =>
  ({
    type: 'DELETE_TASK_GROUP_SUCCESS'
  } as const);

const deleteTaskGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_TASK_GROUP_FAILURE',
    error
  } as const;
};

export const deleteTaskGroup = (
  taskGroupId: string,
  organizationId: string,
  history: History
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(deleteTaskGroupRequest());

    await axios.delete(`/api/v3.01/taskGroups(${taskGroupId})`);

    dispatch(deleteTaskGroupSuccess());

    history.push(`/${organizationId}/alerts/taskGroups/all`);
  } catch (error) {
    dispatch(deleteTaskGroupFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof deleteTaskGroupRequest>
  | ReturnType<typeof deleteTaskGroupSuccess>
  | ReturnType<typeof deleteTaskGroupFailure>;
