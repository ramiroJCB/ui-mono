import { Actions } from './actions/fetchClient';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClient } from 'interfaces/client';

export type State = DeepReadonly<{
  isFetching: boolean;
  client: IClient | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  client: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_SAFETY_PROGRAM_CLIENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAM_CLIENT_SUCCESS':
      return {
        isFetching: false,
        client: action.payload,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAM_CLIENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
