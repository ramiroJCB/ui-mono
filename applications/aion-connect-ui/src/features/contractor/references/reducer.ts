import { Actions as FetchReferencesActions } from './actions';
import { Actions as AddReferenceActions } from '../reference/actions/addReference';
import { Actions as DeleteReferenceActions } from '../reference/actions/deleteReference';
import { Actions as EditReferenceActions } from '../reference/actions/editReference';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReference } from 'interfaces/reference';

export type State = DeepReadonly<{
  isFetching: boolean;
  references: IReference[];
  error: AxiosError | null;
}>;

type Actions = FetchReferencesActions | AddReferenceActions | EditReferenceActions | DeleteReferenceActions;

export const initialState: State = {
  isFetching: false,
  references: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REFERENCES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_REFERENCES_SUCCESS':
      return {
        isFetching: false,
        references: action.payload,
        error: null
      };
    case 'ADD_REFERENCE_SUCCESS':
      return {
        ...state,
        references: [action.payload, ...state.references].sort((a, b) => a.name.localeCompare(b.name))
      };
    case 'EDIT_REFERENCE_SUCCESS':
      return {
        ...state,
        references: state.references.map(reference => (reference.id === action.payload.id ? action.payload : reference))
      };
    case 'DELETE_REFERENCE_SUCCESS':
      return {
        ...state,
        references: state.references.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_REFERENCES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
