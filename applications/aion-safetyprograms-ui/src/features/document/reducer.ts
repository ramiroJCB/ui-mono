import { Actions as AddDocumentActions } from './actions/addDocument';
import { Actions as FetchDocumentActions } from './actions/fetchDocument';
import { Actions as UpdateDocumentScaleActions } from './actions/updateDocumentScale';
import { AxiosError, CancelTokenSource } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IDocument } from 'interfaces/document';

export type State = DeepReadonly<{
  isFetching: boolean;
  source: CancelTokenSource | null;
  progress: number;
  document: IDocument | null;
  scale: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  source: null,
  progress: 0,
  document: null,
  scale: 0.7,
  error: null
};

type Actions = AddDocumentActions | FetchDocumentActions | UpdateDocumentScaleActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_DOCUMENT_REQUEST':
      return {
        ...state,
        source: action.source,
        error: null
      };
    case 'FETCH_DOCUMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_DOCUMENT_PROGRESS':
      return {
        ...state,
        progress: action.progress
      };
    case 'ADD_DOCUMENT_SUCCESS':
      return {
        ...state,
        source: null,
        progress: 0,
        document: action.payload,
        error: null
      };
    case 'FETCH_DOCUMENT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        document: action.payload,
        error: null
      };
    case 'ADD_DOCUMENT_FAILURE':
      return {
        ...state,
        source: null,
        progress: 0,
        error: action.error
      };
    case 'FETCH_DOCUMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_DOCUMENT_RESET':
      return initialState;
    case 'UPDATE_DOCUMENT_SCALE':
      return {
        ...state,
        scale: action.scale
      };
    default:
      return state;
  }
}
