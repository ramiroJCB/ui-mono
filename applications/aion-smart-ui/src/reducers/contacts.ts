import { Actions } from 'actions/contacts';
import { AxiosError } from 'axios';
import { ContactActions } from 'combineActions';
import { IContact } from 'interfaces/contact';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  contacts: IContact[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  contacts: null,
  error: null
};

const sortComparator = (a: IContact, b: IContact) =>
  `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);

export function reducer(state: State = initialState, action: Actions | ContactActions): State {
  switch (action.type) {
    case 'FETCH_CONTACTS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTACTS_SUCCESS':
      return {
        isFetching: false,
        contacts: action.payload.sort(sortComparator),
        error: null
      };
    case 'FETCH_CONTACTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_CONTACT_SUCCESS':
      return {
        ...state,
        contacts: state.contacts && [...state.contacts, action.payload].sort(sortComparator)
      };
    case 'DELETE_CONTACT_SUCCESS':
      return {
        ...state,
        contacts: state.contacts && state.contacts.filter(({ id }) => id !== action.contactId)
      };
    case 'UPDATE_CONTACT_SUCCESS':
      return {
        ...state,
        contacts:
          state.contacts &&
          state.contacts.map(p => (p.id === action.payload.id ? action.payload : p)).sort(sortComparator)
      };
    default:
      return state;
  }
}
