import axios, { AxiosError } from 'axios';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteTaskGroupAttachmentRequest = (payload: string) =>
  ({
    type: 'DELETE_TASK_GROUP_ATTACHMENT_REQUEST',
    payload
  } as const);

const deleteTaskGroupAttachmentSuccess = (payload: string) =>
  ({
    type: 'DELETE_TASK_GROUP_ATTACHMENT_SUCCESS',
    payload
  } as const);

const deleteTaskGroupAttachmentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_TASK_GROUP_ATTACHMENT_FAILURE',
    error
  } as const;
};

export const deleteTaskGroupAttachment = (
  id: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(deleteTaskGroupAttachmentRequest(id));

    await axios.delete(`/files/v3.01/taskGroupAttachments(${id})`);

    dispatch(deleteTaskGroupAttachmentSuccess(id));
  } catch (error) {
    dispatch(deleteTaskGroupAttachmentFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof deleteTaskGroupAttachmentRequest>
  | ReturnType<typeof deleteTaskGroupAttachmentSuccess>
  | ReturnType<typeof deleteTaskGroupAttachmentFailure>;
