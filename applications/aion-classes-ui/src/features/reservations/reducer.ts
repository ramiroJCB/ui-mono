import { Actions as FetchReservationsActions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';

export type State = DeepReadonly<{
  isFetching: boolean;
  reservations: IReservation[] | null;
  totalCount: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  reservations: null,
  totalCount: null,
  error: null
};

type Actions = FetchReservationsActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_RESERVATIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_RESERVATIONS_SUCCESS':
      return {
        isFetching: false,
        reservations: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_RESERVATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
