import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IMetricContractor } from 'interfaces/metricContractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractors: IMetricContractor[] | null;
  error: AxiosError | null;
  totalCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  contractors: null,
  error: null,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONAL_CONTRACTORS_SUCCESS':
      return {
        isFetching: false,
        contractors: action.payload,
        error: null,
        totalCount: action.totalCount
      };
    case 'FETCH_REGIONAL_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
