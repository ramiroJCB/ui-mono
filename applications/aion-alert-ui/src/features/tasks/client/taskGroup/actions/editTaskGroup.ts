import axios, { AxiosError } from 'axios';
import moment from 'moment/moment';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ITaskGroupForm } from 'interfaces/taskGroupForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const editTaskGroupRequest = () =>
  ({
    type: 'EDIT_TASK_GROUP_REQUEST'
  } as const);

const editTaskGroupSuccess = (payload: ITaskGroup) =>
  ({
    type: 'EDIT_TASK_GROUP_SUCCESS',
    payload
  } as const);

const editTaskGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_TASK_GROUP_FAILURE',
    error
  } as const;
};

export const editTaskGroup = (
  taskGroupForm: ITaskGroupForm,
  pendingAttachments: ReadonlyArray<IAttachmentWithStatus>,
  taskGroupId: string
): ThunkAction<Promise<ITaskGroup>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(editTaskGroupRequest());

      const { Uploaded } = AttachmentStatus;
      const taskGroup: ITaskGroupForm = {
        ...taskGroupForm,
        attachments: [
          ...taskGroupForm.attachments,
          ...pendingAttachments.filter(attachment => attachment.status === Uploaded)
        ],
        dueDateUtc: moment(taskGroupForm.dueDateUtc).toISOString()
      };

      const { data } = await axios.put<ITaskGroup>(`/api/v3.01/taskGroups(${taskGroupId})`, taskGroup);

      dispatch(editTaskGroupSuccess(data));

      resolve(data);
    } catch (error) {
      dispatch(editTaskGroupFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof editTaskGroupRequest>
  | ReturnType<typeof editTaskGroupSuccess>
  | ReturnType<typeof editTaskGroupFailure>;
