import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservationsUser } from '@pec/aion-ui-core/interfaces/reservation';

export type State = DeepReadonly<{
  isFetching: boolean;
  creators: IReservationsUser[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  creators: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CREATORS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CREATORS_SUCCESS':
      return {
        isFetching: false,
        creators: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_CREATORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
