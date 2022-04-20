import { Action as RemovePendingEnvelopeDocumentAction } from './actions/removePendingDocument';
import { Actions as AddEnvelopeActions } from './add/actions/addEnvelope';
import { Actions as AddEnvelopeDocumentActions } from './add/actions/addEnvelopeDocument';
import { Actions as FetchEnvelopeActions } from './view/actions/fetchEnvelope';
import { Actions as DownloadEnvelopeDocumentActions } from './view/actions/downloadEnvelopeDocument';
import { Actions as RemoveEnvelopeActions } from './view/actions/removeEnvelope';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';

const { Uploaded, Uploading } = AttachmentStatus;

export type State = DeepReadonly<{
  isFetching: boolean;
  envelope: IEnvelope | null;
  error: AxiosError | null;
  pendingDocument: IDocumentWithStatus | null;
  downloadingDocumentIds: string[];
}>;

export const initialState: State = {
  isFetching: false,
  envelope: null,
  error: null,
  pendingDocument: null,
  downloadingDocumentIds: []
};

type Actions =
  | AddEnvelopeActions
  | AddEnvelopeDocumentActions
  | DownloadEnvelopeDocumentActions
  | FetchEnvelopeActions
  | RemovePendingEnvelopeDocumentAction
  | RemoveEnvelopeActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_ENVELOPE_REQUEST':
    case 'FETCH_ENVELOPE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_ENVELOPE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case 'FETCH_ENVELOPE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        envelope: action.payload,
        error: null
      };
    case 'ADD_ENVELOPE_FAILURE':
    case 'FETCH_ENVELOPE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_ENVELOPE_DOCUMENT_REQUEST':
      return {
        ...state,
        pendingDocument: {
          id: '',
          fileName: action.payload.name,
          mimeType: action.payload.type,
          status: Uploading
        }
      };
    case 'ADD_ENVELOPE_DOCUMENT_SUCCESS':
      return {
        ...state,
        pendingDocument: state.pendingDocument
          ? { ...state.pendingDocument, id: action.payload, status: Uploaded }
          : state.pendingDocument
      };
    case 'ADD_ENVELOPE_DOCUMENT_FAILURE':
    case 'REMOVE_PENDING_ENVELOPE_DOCUMENT':
      return {
        ...state,
        pendingDocument: initialState.pendingDocument
      };
    case 'DOWNLOAD_ENVELOPE_DOCUMENT_REQUEST': {
      return {
        ...state,
        downloadingDocumentIds: [...state.downloadingDocumentIds, action.payload]
      };
    }
    case 'DOWNLOAD_ENVELOPE_DOCUMENT_SUCCESS': {
      return {
        ...state,
        downloadingDocumentIds: state.downloadingDocumentIds.filter(document => document !== action.payload)
      };
    }
    case 'DOWNLOAD_ENVELOPE_DOCUMENT_FAILURE': {
      return {
        ...state,
        downloadingDocumentIds: state.downloadingDocumentIds.filter(document => document !== action.payload),
        error: action.error
      };
    }
    case 'REMOVE_ENVELOPE': {
      return {
        ...state,
        envelope: initialState.envelope
      };
    }
    default:
      return state;
  }
}
