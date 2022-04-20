import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClientPeriod } from 'interfaces/clientPeriod';

export type State = DeepReadonly<{
  isFetching: boolean;
  clientPeriods: IClientPeriod[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  clientPeriods: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_PERIODS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_PERIODS_SUCCESS':
      return {
        isFetching: false,
        clientPeriods: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_PERIODS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
