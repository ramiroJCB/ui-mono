import axios, { AxiosError } from 'axios';
import { ICreatedMessage } from 'interfaces/message';
import { ICreatedThread, IThread } from 'interfaces/thread';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const addThreadWithMessageRequest = () =>
  ({
    type: 'ADD_THREAD_WITH_MESSAGE_REQUEST'
  } as const);

const addThreadWithMessageSuccess = (
  payload: ICreatedMessage,
  status: ITaskAssigneeStatus,
  thread: ICreatedThread,
  sortOrder: 'asc' | 'desc'
) =>
  ({
    type: 'ADD_THREAD_WITH_MESSAGE_SUCCESS',
    payload,
    sortOrder,
    status,
    thread
  } as const);

const addThreadWithMessageFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_THREAD_WITH_MESSAGE_FAILURE',
    error
  } as const;
};

export const addThreadWithMessage = (
  taskId: string,
  thread: IThread,
  status: TaskStatus,
  { sortOrder }: ParsedUrlQuery
): ThunkAction<Promise<ICreatedMessage>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addThreadWithMessageRequest());

      const { data: createdThread } = await axios.post<ICreatedThread>(`/api/v3.01/tasks(${taskId})/threads`, thread);

      axios.patch(`/api/v3.01/tasks(${taskId})`, [
        {
          op: 'replace',
          path: '/threadId',
          value: createdThread.id
        }
      ]);

      const newMessage = createdThread.messages[0];

      const { data: createdStatus } = await axios.post<ITaskAssigneeStatus>(`/api/v3.01/tasks(${taskId})/statuses`, {
        messageId: newMessage.id,
        status: status
      });

      dispatch(addThreadWithMessageSuccess(newMessage, createdStatus, createdThread, sortOrder as 'asc' | 'desc'));
      resolve(newMessage);
    } catch (error) {
      dispatch(addThreadWithMessageFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addThreadWithMessageRequest>
  | ReturnType<typeof addThreadWithMessageSuccess>
  | ReturnType<typeof addThreadWithMessageFailure>;
