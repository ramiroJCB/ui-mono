import { Actions as AddReservationActions } from './actions/addReservation';
import { Actions as FetchReservationActions } from './actions/fetchReservation';
import { Actions as UpdateReservationActions } from './actions/updateReservation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';

export type State = DeepReadonly<{
  isFetching: boolean;
  reservation: IReservation | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  reservation: null,
  error: null
};

type Actions = AddReservationActions | FetchReservationActions | UpdateReservationActions;

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_RESERVATION_REQUEST':
    case 'FETCH_RESERVATION_REQUEST':
    case 'UPDATE_RESERVATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_RESERVATION_SUCCESS':
    case 'FETCH_RESERVATION_SUCCESS':
    case 'UPDATE_RESERVATION_SUCCESS':
      return {
        isFetching: false,
        reservation: action.payload,
        error: null
      };
    case 'ADD_RESERVATION_FAILURE':
    case 'FETCH_RESERVATION_FAILURE':
    case 'UPDATE_RESERVATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
