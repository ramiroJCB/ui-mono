import axios, { AxiosError } from 'axios';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ICreatedMessage, IMessage } from 'interfaces/message';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const { Complete } = TaskStatus;

const completeTaskRequest = () =>
  ({
    type: 'COMPLETE_TASK_REQUEST'
  } as const);

const completeTaskSuccess = (payload: ITaskAssigneeStatus, message: ICreatedMessage) =>
  ({
    type: 'COMPLETE_TASK_SUCCESS',
    payload,
    message
  } as const);

const completeTaskFailure = (error: AxiosError | null) => {
  if (error) {
    sendError(error);
  }

  return {
    type: 'COMPLETE_TASK_FAILURE',
    error
  } as const;
};

export const completeTask = (
  taskId: string,
  threadId: string,
  message: IMessage,
  status: TaskStatus
): ThunkAction<Promise<ITaskAssigneeStatus>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(completeTaskRequest());
      const { data: createdMessage } = await axios.post<ICreatedMessage>(
        `/api/v3.01/tasks(${taskId})/threads(${threadId})/messages`,
        { ...message, threadId }
      );

      const { data: newStatus } = await axios.post<ITaskAssigneeStatus>(`/api/v3.01/tasks(${taskId})/statuses`, {
        messageId: createdMessage.id,
        status
      });

      dispatch(completeTaskSuccess(newStatus, createdMessage));

      dispatch(
        enqueueSnackbar({
          message: status === Complete ? 'Task now marked as Complete' : 'Task now marked as Submitted',
          options: {
            variant: 'success'
          }
        })
      );

      resolve(newStatus);
    } catch (error) {
      dispatch(completeTaskFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof completeTaskRequest>
  | ReturnType<typeof completeTaskSuccess>
  | ReturnType<typeof completeTaskFailure>;
