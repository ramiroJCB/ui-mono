import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClassReservationAggregate } from 'interfaces/classReservationAggregate';

export type State = DeepReadonly<{
  isFetching: boolean;
  classReservationAggregates: IClassReservationAggregate[] | null;
  totalCount: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  classReservationAggregates: null,
  totalCount: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLASS_RESERVATION_AGGREGATES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CLASS_RESERVATION_AGGREGATES_SUCCESS':
      return {
        isFetching: false,
        classReservationAggregates: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CLASS_RESERVATION_AGGREGATES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
