import { Actions as AddTaskMessageActions } from './actions/addMessage';
import { Actions as AddTaskMessageWithThreadActions } from './actions/addThreadWithMessage';
import { Actions as AddMessageFormAttachmentActions } from './actions/addMessageFormAttachment';
import { Actions as DeleteMessageFormAttachmentActions } from './actions/deleteMessageFormAttachment';
import { Actions as DownloadMessageFormAttachmentActions } from './actions/downloadMessageFormAttachment';
import { Actions as RemovePendingMessageFormAttachmentsActions } from './actions/removePendingMessageFormAttachments';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ICreatedMessage } from 'interfaces/message';

const { Deleting, Downloading, Failed, Uploaded, Uploading } = AttachmentStatus;

export type State = DeepReadonly<{
  isFetching: boolean;
  taskMessage: ICreatedMessage | null;
  error: AxiosError | null;
  uploadedAttachments: IAttachmentWithStatus[];
}>;

export const initialState: State = {
  isFetching: false,
  taskMessage: null,
  error: null,
  uploadedAttachments: []
};

type Actions =
  | AddTaskMessageActions
  | AddTaskMessageWithThreadActions
  | AddMessageFormAttachmentActions
  | DeleteMessageFormAttachmentActions
  | DownloadMessageFormAttachmentActions
  | RemovePendingMessageFormAttachmentsActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_THREAD_WITH_MESSAGE_REQUEST':
    case 'ADD_MESSAGE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_THREAD_WITH_MESSAGE_SUCCESS':
    case 'ADD_MESSAGE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        taskMessage: action.payload,
        error: null,
        uploadedAttachments: []
      };
    case 'ADD_THREAD_WITH_MESSAGE_FAILURE':
    case 'ADD_MESSAGE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_MESSAGE_FORM_ATTACHMENT_REQUEST':
      return {
        ...state,
        uploadedAttachments: [
          ...state.uploadedAttachments,
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
    case 'ADD_MESSAGE_FORM_ATTACHMENT_SUCCESS':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.fileName === action.fileName ? { ...attachment, status: Uploaded, id: action.payload } : attachment
        )
      };
    case 'ADD_MESSAGE_FORM_ATTACHMENT_FAILURE':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.fileName === action.fileName
            ? { ...attachment, status: Failed, causeOfFailure: 'Internal server error' }
            : attachment
        )
      };
    case 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_REQUEST':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.id === action.payload ? { ...attachment, status: Downloading } : attachment
        )
      };
    case 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_SUCCESS':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.id === action.payload ? { ...attachment, status: Uploaded } : attachment
        )
      };
    case 'DOWNLOAD_MESSAGE_FORM_ATTACHMENT_FAILURE':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.id === action.payload
            ? { ...attachment, status: Failed, causeOfFailure: 'Internal Server Error' }
            : attachment
        )
      };
    case 'DELETE_MESSAGE_FORM_ATTACHMENT_REQUEST':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.id === action.payload
            ? {
                ...attachment,
                status: Deleting
              }
            : attachment
        )
      };
    case 'DELETE_MESSAGE_FORM_ATTACHMENT_SUCCESS':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.filter(attachment => attachment.id !== action.payload)
      };
    case 'DELETE_MESSAGE_FORM_ATTACHMENT_FAILURE':
      return {
        ...state,
        uploadedAttachments: state.uploadedAttachments.map(attachment =>
          attachment.id === action.payload
            ? {
                ...attachment,
                status: Failed,
                causeOfFailure: 'Internal Server Error'
              }
            : attachment
        )
      };
    case 'REMOVE_PENDING_MESSAGE_FORM_ATTACHMENTS_REQUEST':
      return {
        ...state,
        uploadedAttachments: initialState.uploadedAttachments
      };
    default:
      return state;
  }
}
