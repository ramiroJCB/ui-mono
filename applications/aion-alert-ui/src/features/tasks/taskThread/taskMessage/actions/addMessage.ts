import axios, { AxiosError } from 'axios';
import { ICreatedMessage } from 'interfaces/message';
import { IMessage } from 'interfaces/message';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkAction } from 'redux-thunk';

const addMessageRequest = () =>
  ({
    type: 'ADD_MESSAGE_REQUEST'
  } as const);

const addMessageSuccess = (payload: ICreatedMessage, status: ITaskAssigneeStatus, sortOrder: 'asc' | 'desc') =>
  ({
    type: 'ADD_MESSAGE_SUCCESS',
    payload,
    status,
    sortOrder
  } as const);

const addMessageFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_MESSAGE_FAILURE',
    error
  } as const;
};

export const addMessage = (
  taskId: string,
  message: IMessage,
  status: TaskStatus,
  { sortOrder }: ParsedUrlQuery
): ThunkAction<Promise<ICreatedMessage>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addMessageRequest());

      const { data: createdMessage } = await axios.post<ICreatedMessage>(
        `/api/v3.01/tasks(${taskId})/threads(${message.threadId})/messages`,
        message
      );

      const { data: createdStatus } = await axios.post<ITaskAssigneeStatus>(`/api/v3.01/tasks(${taskId})/statuses`, {
        messageId: createdMessage.id,
        status: status
      });

      dispatch(addMessageSuccess(createdMessage, createdStatus, sortOrder as 'asc' | 'desc'));
      resolve(createdMessage);
    } catch (error) {
      dispatch(addMessageFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addMessageRequest>
  | ReturnType<typeof addMessageSuccess>
  | ReturnType<typeof addMessageFailure>;
