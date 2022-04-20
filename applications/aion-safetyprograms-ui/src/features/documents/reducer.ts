import { Actions } from './actions/fetchDocuments';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IDocument } from 'interfaces/document';

export type State = DeepReadonly<{
  isFetching: boolean;
  documents: IDocument[] | null;
  total: number | null;
  page: number;
  searchTerm: string;
  $orderby: string;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  documents: null,
  total: null,
  page: 0,
  searchTerm: '',
  $orderby: 'createdDateUtc desc',
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_DOCUMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        page: action.page,
        searchTerm: action.searchTerm,
        $orderby: action.$orderby,
        error: null
      };
    case 'FETCH_DOCUMENTS_SUCCESS':
      return {
        ...state,
        total: action.total,
        isFetching: false,
        documents: action.payload,
        error: null
      };
    case 'FETCH_DOCUMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
