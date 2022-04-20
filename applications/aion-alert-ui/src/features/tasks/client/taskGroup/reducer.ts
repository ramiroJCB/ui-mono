import { Actions as FetchTaskGroupActions } from './actions/fetchTaskGroup';
import { Actions as DownloadTaskGroupAttachmentActions } from './actions/downloadTaskGroupAttachment';
import { Actions as EditTaskGroupActions } from './actions/editTaskGroup';
import { Actions as DeleteTaskGroupActions } from './actions/deleteTaskGroup';
import { Actions as AddTaskGroupAttachmentActions } from './actions/addTaskGroupAttachment';
import { Actions as AddTaskGroupActions } from './actions/addTaskGroup';
import { Actions as DeleteTaskGroupAttachmentActions } from './actions/deleteTaskGroupAttachment';
import { Actions as RemoveTaskGroupPendingAttachmentsActions } from './actions/removePendingAttachments';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';

const { Deleting, Downloading, Failed, Uploading, Uploaded } = AttachmentStatus;

export type State = DeepReadonly<{
  isDeleting: boolean;
  isFetching: boolean;
  taskGroup: ITaskGroup | null;
  error: AxiosError | null;
  pendingAttachments: IAttachmentWithStatus[];
}>;

type Actions =
  | FetchTaskGroupActions
  | AddTaskGroupActions
  | EditTaskGroupActions
  | DeleteTaskGroupActions
  | AddTaskGroupAttachmentActions
  | DownloadTaskGroupAttachmentActions
  | DeleteTaskGroupAttachmentActions
  | RemoveTaskGroupPendingAttachmentsActions;

export const initialState: State = {
  isDeleting: false,
  isFetching: false,
  taskGroup: null,
  error: null,
  pendingAttachments: []
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TASK_GROUP_REQUEST':
    case 'ADD_TASK_GROUP_REQUEST':
    case 'EDIT_TASK_GROUP_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'EDIT_TASK_GROUP_SUCCESS':
    case 'FETCH_TASK_GROUP_SUCCESS':
      return {
        ...state,
        isFetching: false,
        taskGroup: {
          ...action.payload,
          attachments: action.payload.attachments.map(attachment => ({
            ...attachment,
            status: Uploaded
          }))
        },
        pendingAttachments: initialState.pendingAttachments,
        error: null
      };
    case 'ADD_TASK_GROUP_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case 'FETCH_TASK_GROUP_FAILURE':
    case 'ADD_TASK_GROUP_FAILURE':
    case 'EDIT_TASK_GROUP_FAILURE':
    case 'DELETE_TASK_GROUP_FAILURE':
      return {
        ...state,
        isDeleting: false,
        isFetching: false,
        error: action.error
      };
    case 'DELETE_TASK_GROUP_REQUEST':
      return {
        ...state,
        isDeleting: true
      };

    case 'DELETE_TASK_GROUP_SUCCESS':
      return {
        ...state,
        isDeleting: false
      };
    case 'ADD_TASK_GROUP_ATTACHMENT_REQUEST':
      return {
        ...state,
        pendingAttachments: [
          ...state.pendingAttachments,
          ...action.rejectedFiles.map(file => ({
            id: '',
            fileName: file.name,
            mimeType: '',
            status: Failed,
            causeOfFailure: file.reason
          })),
          ...action.payload.map(file => ({
            id: '',
            fileName: file.name,
            mimeType: file.type,
            status: Uploading
          }))
        ]
      };
    case 'ADD_TASK_GROUP_ATTACHMENT_SUCCESS':
      return {
        ...state,
        pendingAttachments: state.pendingAttachments.map(attachment =>
          attachment.fileName === action.fileName ? { ...attachment, status: Uploaded, id: action.payload } : attachment
        )
      };
    case 'ADD_TASK_GROUP_ATTACHMENT_FAILURE':
      return {
        ...state,
        pendingAttachments: state.pendingAttachments.map(attachment =>
          attachment.fileName === action.fileName
            ? { ...attachment, status: Failed, causeOfFailure: 'Internal server error' }
            : attachment
        )
      };
    case 'DOWNLOAD_TASK_GROUP_ATTACHMENT_REQUEST':
      return {
        ...state,
        taskGroup: state.taskGroup
          ? {
              ...state.taskGroup,
              attachments: state.taskGroup.attachments.map(attachment =>
                attachment.id === action.payload
                  ? {
                      ...attachment,
                      status: Downloading
                    }
                  : attachment
              )
            }
          : state.taskGroup,
        pendingAttachments: state.pendingAttachments.map(attachment =>
          attachment.id === action.payload
            ? {
                ...attachment,
                status: Downloading
              }
            : attachment
        )
      };
    case 'DOWNLOAD_TASK_GROUP_ATTACHMENT_SUCCESS':
      return {
        ...state,
        taskGroup: state.taskGroup
          ? {
              ...state.taskGroup,
              attachments: state.taskGroup.attachments.map(attachment =>
                attachment.id === action.payload
                  ? {
                      ...attachment,
                      status: Uploaded
                    }
                  : attachment
              )
            }
          : state.taskGroup,
        pendingAttachments: state.pendingAttachments.map(attachment =>
          attachment.id === action.payload
            ? {
                ...attachment,
                status: Uploaded
              }
            : attachment
        )
      };
    case 'DELETE_TASK_GROUP_ATTACHMENT_REQUEST':
      return {
        ...state,
        taskGroup: state.taskGroup
          ? {
              ...state.taskGroup,
              attachments: state.taskGroup.attachments.filter(attachment => attachment.id !== action.payload)
            }
          : initialState.taskGroup,
        pendingAttachments: state.pendingAttachments.map(attachment =>
          attachment.id === action.payload
            ? {
                ...attachment,
                status: Deleting
              }
            : attachment
        )
      };
    case 'DELETE_TASK_GROUP_ATTACHMENT_SUCCESS':
      return {
        ...state,
        pendingAttachments: state.pendingAttachments.filter(attachment => attachment.id !== action.payload)
      };
    case 'REMOVE_TASK_GROUP_PENDING_ATTACHMENTS':
      return {
        ...state,
        pendingAttachments: initialState.pendingAttachments
      };
    default:
      return state;
  }
}
