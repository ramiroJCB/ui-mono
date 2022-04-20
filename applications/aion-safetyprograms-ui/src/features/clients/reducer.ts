import { Actions } from './actions/fetchClients';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClient } from 'interfaces/client';

export type State = DeepReadonly<{
  isFetching: boolean;
  clients: IClient[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  clients: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_SAFETY_PROGRAM_CLIENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAM_CLIENTS_SUCCESS':
      return {
        isFetching: false,
        clients: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAM_CLIENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
