import { Actions as AddReferenceActions } from './actions/addReference';
import { Actions as DeleteReferenceActions } from './actions/deleteReference';
import { Actions as EditReferenceActions } from './actions/editReference';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReference } from 'interfaces/reference';

export type State = DeepReadonly<{
  isFetching: boolean;
  reference: IReference | null;
  error: AxiosError | null;
}>;

type Actions = AddReferenceActions | EditReferenceActions | DeleteReferenceActions;

export const initialState: State = {
  isFetching: false,
  reference: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_REFERENCE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_REFERENCE_SUCCESS':
    case 'EDIT_REFERENCE_SUCCESS':
      return {
        isFetching: false,
        reference: action.payload,
        error: null
      };
    case 'DELETE_REFERENCE_SUCCESS':
      return {
        isFetching: false,
        reference: null,
        error: null
      };
    case 'ADD_REFERENCE_FAILURE':
    case 'EDIT_REFERENCE_FAILURE':
    case 'DELETE_REFERENCE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
