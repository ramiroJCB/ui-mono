import axios, { AxiosError } from 'axios';
import { ICreatedMessage } from 'interfaces/message';
import { ICreatedThread, IThread } from 'interfaces/thread';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const addThreadAndCompleteTaskRequest = () =>
  ({
    type: 'ADD_THREAD_AND_COMPLETE_TASK_REQUEST'
  } as const);

const addThreadAndCompleteTaskSuccess = (
  payload: ICreatedThread,
  status: ITaskAssigneeStatus,
  message: ICreatedMessage
) =>
  ({
    type: 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS',
    payload,
    status,
    message
  } as const);

const addThreadAndCompleteTaskFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_THREAD_AND_COMPLETE_TASK_FAILURE',
    error
  } as const;
};

export const addThreadAndCompleteTask = (
  taskId: string,
  thread: IThread,
  status: TaskStatus
): ThunkAction<Promise<ITaskAssigneeStatus>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addThreadAndCompleteTaskRequest());

      const { data: createdThread } = await axios.post<ICreatedThread>(`/api/v3.01/tasks(${taskId})/threads`, thread);

      axios.patch(`/api/v3.01/tasks(${taskId})`, [
        {
          op: 'replace',
          path: '/threadId',
          value: createdThread.id
        }
      ]);

      const newMessage = createdThread.messages[0];

      const { data: newStatus } = await axios.post<ITaskAssigneeStatus>(`/api/v3.01/tasks(${taskId})/statuses`, {
        messageId: newMessage.id,
        status
      });

      dispatch(addThreadAndCompleteTaskSuccess(createdThread, newStatus, newMessage));

      resolve(newStatus);
    } catch (error) {
      dispatch(addThreadAndCompleteTaskFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addThreadAndCompleteTaskRequest>
  | ReturnType<typeof addThreadAndCompleteTaskSuccess>
  | ReturnType<typeof addThreadAndCompleteTaskFailure>;
