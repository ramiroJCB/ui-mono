import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservationsUser } from '@pec/aion-ui-core/interfaces/reservation';

export type State = DeepReadonly<{
  isFetching: boolean;
  filters: {
    creators: IReservationsUser[];
  } | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  filters: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_RESERVATION_REPORT_FILTERS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_RESERVATION_REPORT_FILTERS_SUCCESS':
      return {
        isFetching: false,
        filters: action.payload,
        error: null
      };
    case 'FETCH_RESERVATION_REPORT_FILTERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
