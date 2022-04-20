import { Actions as AddMandateActions } from './actions/addMandate';
import { Actions as DeleteMandateActions } from './actions/deleteMandate';
import { Actions as FetchMandateActions } from './actions/fetchMandate';
import { Actions as UpdateMandateActions } from './actions/updateMandate';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IExpandedMandate } from 'interfaces/mandate';

export type State = DeepReadonly<{
  isFetching: boolean;
  mandate: IExpandedMandate | null;
  error: AxiosError | null;
}>;

type Actions = AddMandateActions | DeleteMandateActions | FetchMandateActions | UpdateMandateActions;

export const initialState: State = {
  isFetching: false,
  mandate: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_MANDATE_REQUEST':
    case 'DELETE_MANDATE_REQUEST':
    case 'FETCH_MANDATE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'UPDATE_MANDATE_REQUEST':
      return {
        ...state,
        error: null
      };
    case 'ADD_MANDATE_SUCCESS':
    case 'FETCH_MANDATE_SUCCESS':
    case 'UPDATE_MANDATE_SUCCESS':
      return {
        isFetching: false,
        mandate: action.payload,
        error: null
      };
    case 'DELETE_MANDATE_SUCCESS':
      return {
        isFetching: false,
        mandate: null,
        error: null
      };
    case 'ADD_MANDATE_FAILURE':
    case 'DELETE_MANDATE_FAILURE':
    case 'FETCH_MANDATE_FAILURE':
    case 'UPDATE_MANDATE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
