import { Actions as AddReferenceActions } from './actions/addReference';
import { Actions as DeleteReferenceActions } from './actions/deleteReference';
import { Actions as FetchReferenceActions } from './actions/fetchReference';
import { Actions as UpdateReferenceActions } from './actions/updateReference';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReference } from 'interfaces/reference';

export type State = DeepReadonly<{
  isFetching: boolean;
  reference: IReference | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  reference: null,
  error: null
};

type Actions = AddReferenceActions | DeleteReferenceActions | FetchReferenceActions | UpdateReferenceActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_REFERENCE_REQUEST':
    case 'DELETE_REFERENCE_REQUEST':
    case 'FETCH_REFERENCE_REQUEST':
    case 'UPDATE_REFERENCE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_REFERENCE_SUCCESS':
    case 'FETCH_REFERENCE_SUCCESS':
    case 'UPDATE_REFERENCE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        reference: action.payload,
        error: null
      };
    case 'DELETE_REFERENCE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        reference: null,
        error: null
      };
    case 'ADD_REFERENCE_FAILURE':
    case 'DELETE_REFERENCE_FAILURE':
    case 'FETCH_REFERENCE_FAILURE':
    case 'UPDATE_REFERENCE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
