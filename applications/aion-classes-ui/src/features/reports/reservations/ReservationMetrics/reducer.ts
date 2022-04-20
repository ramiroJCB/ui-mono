import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservationMetrics } from 'interfaces/reservationMetrics';

export type State = DeepReadonly<{
  isFetching: boolean;
  reservationMetrics: IReservationMetrics | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  reservationMetrics: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_RESERVATION_METRICS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_RESERVATION_METRICS_SUCCESS':
      return {
        isFetching: false,
        reservationMetrics: action.payload,
        error: null
      };
    case 'FETCH_RESERVATION_METRICS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
