import { Actions as FetchTaskMessagesActions } from './actions/fetchTaskMessages';
import { Actions as DownloadMessageAttachmentActions } from './actions/downloadMessageAttachment';
import { Actions as FetchAssigneeAttachmentsCountActions } from './actions/fetchAssigneeAttachmentsCount';
import { Actions as AddTaskMessageWithThreadActions } from '../taskMessage/actions/addThreadWithMessage';
import { Actions as CompleteTaskActions } from '../taskAssigneeDetails/actions/completeTask';
import { Actions as CompleteTaskWithThreadActions } from '../taskAssigneeDetails/actions/addThreadAndCompleteTask';
import { Actions as AddTaskMessageActions } from '../taskMessage/actions/addMessage';
import { Actions as FetchTaskAssigneeDetailsActions } from '../taskAssigneeDetails/actions/fetchTaskAssigneeDetails';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ICreatedMessage } from 'interfaces/message';

const { Downloading, Failed, Uploaded } = AttachmentStatus;

export type State = DeepReadonly<{
  isFetching: boolean;
  taskMessages: ICreatedMessage[] | null;
  totalCount: number;
  totalAssigneeAttachmentsCount: number;
  error: AxiosError | null;
}>;

export type Actions =
  | FetchTaskMessagesActions
  | AddTaskMessageActions
  | AddTaskMessageWithThreadActions
  | CompleteTaskActions
  | CompleteTaskWithThreadActions
  | DownloadMessageAttachmentActions
  | FetchTaskAssigneeDetailsActions
  | FetchAssigneeAttachmentsCountActions;

export const initialState: State = {
  isFetching: false,
  taskMessages: null,
  totalCount: 0,
  totalAssigneeAttachmentsCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TASK_MESSAGES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ASSIGNEE_ATTACHMENTS_COUNT_SUCCESS':
      return {
        ...state,
        totalAssigneeAttachmentsCount: action.payload
      };
    case 'FETCH_TASK_MESSAGES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        taskMessages: action.taskMessages.map(message => ({
          ...message,
          attachments: message.attachments.map(attachment => ({
            ...attachment,
            status: Uploaded
          }))
        })),
        totalCount: action.totalCount,
        error: null
      };
    case 'ADD_THREAD_WITH_MESSAGE_SUCCESS':
    case 'ADD_MESSAGE_SUCCESS':
      if (state.taskMessages && state.taskMessages.length >= 10 && action.sortOrder === 'desc') {
        return {
          ...state,
          taskMessages: [
            {
              ...action.payload,
              attachments: action.payload.attachments.map(attachment => ({ ...attachment, status: Uploaded }))
            },
            ...state.taskMessages.slice(0, state.taskMessages.length - 1)
          ],
          totalCount: state.totalCount + 1,
          totalAssigneeAttachmentsCount:
            action.payload.attachments.length > 0
              ? state.totalAssigneeAttachmentsCount + 1
              : state.totalAssigneeAttachmentsCount
        };
      }

      return {
        ...state,
        taskMessages: state.taskMessages
          ? [
              {
                ...action.payload,
                attachments: action.payload.attachments.map(attachment => ({ ...attachment, status: Uploaded }))
              },
              ...state.taskMessages
            ]
          : [action.payload],
        totalCount: state.totalCount + 1,
        totalAssigneeAttachmentsCount:
          action.payload.attachments.length > 0
            ? state.totalAssigneeAttachmentsCount + 1
            : state.totalAssigneeAttachmentsCount
      };
    case 'FETCH_TASK_MESSAGES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'FETCH_ASSIGNEE_ATTACHMENTS_COUNT_FAILURE':
      return {
        ...state,
        error: action.error
      };
    case 'COMPLETE_TASK_SUCCESS':
    case 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS': {
      return {
        ...state,
        taskMessages: state.taskMessages ? [action.message, ...state.taskMessages] : [action.message],
        totalCount: state.totalCount + 1
      };
    }
    case 'DOWNLOAD_MESSAGE_ATTACHMENT_REQUEST': {
      return {
        ...state,
        taskMessages: state.taskMessages
          ? state.taskMessages.map(message => ({
              ...message,
              attachments: message.attachments.map(attachment =>
                attachment.id === action.payload ? { ...attachment, status: Downloading } : attachment
              )
            }))
          : state.taskMessages
      };
    }
    case 'DOWNLOAD_MESSAGE_ATTACHMENT_SUCCESS':
      return {
        ...state,
        taskMessages: state.taskMessages
          ? state.taskMessages.map(message => ({
              ...message,
              attachments: message.attachments.map(attachment =>
                attachment.id === action.payload ? { ...attachment, status: Uploaded } : attachment
              )
            }))
          : state.taskMessages
      };
    case 'DOWNLOAD_MESSAGE_ATTACHMENT_FAILURE':
      return {
        ...state,
        taskMessages: state.taskMessages
          ? state.taskMessages.map(message => ({
              ...message,
              attachments: message.attachments.map(attachment =>
                attachment.id === action.payload
                  ? { ...attachment, status: Failed, causeOfFailure: 'Internal Server Error' }
                  : attachment
              )
            }))
          : state.taskMessages
      };
    case 'FETCH_TASK_ASSIGNEE_DETAILS_REQUEST':
      return initialState;
    default:
      return state;
  }
}
