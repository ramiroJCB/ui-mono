import { Actions as FetchTaskAssigneeDetailsActions } from './actions/fetchTaskAssigneeDetails';
import { Actions as DownloadThreadTaskGroupAttachments } from './actions/downloadThreadTaskGroupAttachment';
import { Actions as CompleteTaskActions } from './actions/completeTask';
import { Actions as CompleteTaskWithThreadActions } from './actions/addThreadAndCompleteTask';
import { Actions as AddTaskMessageActions } from '../taskMessage/actions/addMessage';
import { Actions as AddTaskMessageWithThreadActions } from '../taskMessage/actions/addThreadWithMessage';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITaskAssigneeDetails } from 'interfaces/taskAssigneeDetails';

const { Downloading, Failed, Uploaded } = AttachmentStatus;

export type State = DeepReadonly<{
  isCompleting: boolean;
  isFetching: boolean;
  taskAssigneeDetails: ITaskAssigneeDetails | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isCompleting: false,
  isFetching: false,
  taskAssigneeDetails: null,
  error: null
};

type Actions =
  | FetchTaskAssigneeDetailsActions
  | CompleteTaskActions
  | CompleteTaskWithThreadActions
  | AddTaskMessageActions
  | AddTaskMessageWithThreadActions
  | DownloadThreadTaskGroupAttachments;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TASK_ASSIGNEE_DETAILS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TASK_ASSIGNEE_DETAILS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        taskAssigneeDetails: {
          ...action.payload,
          meta: {
            taskGroup: {
              ...action.payload.meta.taskGroup,
              attachments: [
                ...action.payload.meta.taskGroup.attachments.map(attachment => ({
                  ...attachment,
                  status: AttachmentStatus.Uploaded
                }))
              ]
            }
          }
        },
        error: null
      };
    case 'FETCH_TASK_ASSIGNEE_DETAILS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_THREAD_AND_COMPLETE_TASK_REQUEST':
    case 'COMPLETE_TASK_REQUEST':
      return {
        ...state,
        isCompleting: true
      };
    case 'COMPLETE_TASK_SUCCESS': {
      return {
        ...state,
        isCompleting: false,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              statuses: [...state.taskAssigneeDetails.statuses, action.payload]
            }
          : state.taskAssigneeDetails
      };
    }
    case 'ADD_THREAD_AND_COMPLETE_TASK_SUCCESS': {
      return {
        ...state,
        isCompleting: false,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              threadId: action.payload.id,
              statuses: [...state.taskAssigneeDetails.statuses, action.status]
            }
          : state.taskAssigneeDetails
      };
    }
    case 'ADD_MESSAGE_SUCCESS': {
      return {
        ...state,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              statuses: [...state.taskAssigneeDetails.statuses, action.status]
            }
          : state.taskAssigneeDetails
      };
    }
    case 'ADD_THREAD_WITH_MESSAGE_SUCCESS': {
      return {
        ...state,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              threadId: action.thread.id,
              statuses: [...state.taskAssigneeDetails.statuses, action.status]
            }
          : state.taskAssigneeDetails
      };
    }
    case 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_REQUEST':
      return {
        ...state,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              meta: {
                ...state.taskAssigneeDetails.meta,
                taskGroup: {
                  ...state.taskAssigneeDetails.meta.taskGroup,
                  attachments: state.taskAssigneeDetails.meta.taskGroup.attachments.map(attachment =>
                    attachment.id === action.payload
                      ? {
                          ...attachment,
                          status: Downloading
                        }
                      : attachment
                  )
                }
              }
            }
          : state.taskAssigneeDetails
      };
    case 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_SUCCESS':
      return {
        ...state,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              meta: {
                ...state.taskAssigneeDetails.meta,
                taskGroup: {
                  ...state.taskAssigneeDetails.meta.taskGroup,
                  attachments: state.taskAssigneeDetails.meta.taskGroup.attachments.map(attachment =>
                    attachment.id === action.payload
                      ? {
                          ...attachment,
                          status: Uploaded
                        }
                      : attachment
                  )
                }
              }
            }
          : state.taskAssigneeDetails
      };
    case 'DOWNLOAD_THREAD_TASK_GROUP_ATTACHMENT_FAILURE':
      return {
        ...state,
        taskAssigneeDetails: state.taskAssigneeDetails
          ? {
              ...state.taskAssigneeDetails,
              meta: {
                ...state.taskAssigneeDetails.meta,
                taskGroup: {
                  ...state.taskAssigneeDetails.meta.taskGroup,
                  attachments: state.taskAssigneeDetails.meta.taskGroup.attachments.map(attachment =>
                    attachment.id === action.payload
                      ? {
                          ...attachment,
                          status: Failed,
                          causeOfFailure: 'Internal Server Error'
                        }
                      : attachment
                  )
                }
              }
            }
          : state.taskAssigneeDetails,
        error: action.error
      };
    default:
      return state;
  }
}
