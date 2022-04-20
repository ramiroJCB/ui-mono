import { AxiosError } from 'axios';
import { ContactActions as Actions } from 'combineActions';
import { IContact } from 'interfaces/contact';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  isDeleting: boolean;
  contact: IContact | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  isDeleting: false,
  contact: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTACT_REQUEST':
    case 'ADD_CONTACT_REQUEST':
    case 'UPDATE_CONTACT_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'DELETE_CONTACT_REQUEST':
      return {
        ...state,
        isDeleting: true
      };
    case 'FETCH_CONTACT_SUCCESS':
    case 'ADD_CONTACT_SUCCESS':
    case 'UPDATE_CONTACT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        contact: action.payload,
        error: null
      };
    case 'DELETE_CONTACT_SUCCESS':
      return {
        isFetching: false,
        isDeleting: false,
        contact: null,
        error: null
      };
    case 'FETCH_CONTACT_FAILURE':
    case 'ADD_CONTACT_FAILURE':
    case 'UPDATE_CONTACT_FAILURE':
    case 'DELETE_CONTACT_FAILURE':
      return {
        ...state,
        isFetching: false,
        isDeleting: false,
        error: action.error
      };
    default:
      return state;
  }
}
