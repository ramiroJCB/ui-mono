import axios, { AxiosError } from 'axios';
import { ICreatedMessage } from 'interfaces/message';
import { makeSkipParam } from '@pec/aion-ui-odata/helpers/formatters';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTaskMessagesRequest = () =>
  ({
    type: 'FETCH_TASK_MESSAGES_REQUEST'
  } as const);

const fetchTaskMessagesSuccess = (taskMessages: ICreatedMessage[], totalCount: number) =>
  ({
    type: 'FETCH_TASK_MESSAGES_SUCCESS',
    taskMessages,
    totalCount
  } as const);

const fetchTaskMessagesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TASK_MESSAGES_FAILURE',
    error
  } as const;
};

const shouldFetchTaskMessages = ({ taskMessages: { isFetching } }: RootState) => !isFetching;

const fetchTaskMessages = (
  taskId: string,
  threadId: string,
  { page, sortOrder }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTaskMessagesRequest());

    const $top = 10;
    const $skip = makeSkipParam(page || '1', $top);
    const {
      data: { '@odata.count': totalCount, value: taskMessages }
    } = await axios.get<{ '@odata.count': number; value: ICreatedMessage[] }>(
      `/api/v3.01/tasks(${taskId})/threads(${threadId})/messages`,
      {
        params: {
          $expand: 'recipients,attachments',
          $top,
          $skip,
          $orderBy: `createdDateUtc ${sortOrder || 'desc'}`
        }
      }
    );

    dispatch(fetchTaskMessagesSuccess(taskMessages, totalCount));
  } catch (error) {
    dispatch(fetchTaskMessagesFailure(error));
  }
};

export const fetchTaskMessagesIfNeeded = (
  taskId: string,
  threadId: string,
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTaskMessages(getState())) {
    dispatch(fetchTaskMessages(taskId, threadId, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchTaskMessagesRequest>
  | ReturnType<typeof fetchTaskMessagesSuccess>
  | ReturnType<typeof fetchTaskMessagesFailure>;
