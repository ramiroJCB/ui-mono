import { Actions as AddContactInformationActions } from './actions/addContactInformation';
import { Actions as EditContactInformationActions } from './actions/editContactInformation';
import { Actions as FetchContactInformationActions } from './actions/fetchContactInformation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContactInformation } from 'interfaces/contactInformation';

export type State = DeepReadonly<{
  isFetching: boolean;
  contactInformation: IContactInformation | null;
  error: AxiosError | null;
}>;

type Actions = AddContactInformationActions | EditContactInformationActions | FetchContactInformationActions;

export const initialState: State = {
  isFetching: false,
  contactInformation: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTACT_INFORMATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_CONTACT_INFORMATION_SUCCESS':
    case 'EDIT_CONTACT_INFORMATION_SUCCESS':
    case 'FETCH_CONTACT_INFORMATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        contactInformation: action.payload,
        error: null
      };
    case 'ADD_CONTACT_INFORMATION_FAILURE':
    case 'EDIT_CONTACT_INFORMATION_FAILURE':
    case 'FETCH_CONTACT_INFORMATION_FAILURE':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
