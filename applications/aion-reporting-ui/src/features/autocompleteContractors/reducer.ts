import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContractor } from 'interfaces/contractor';
import { IMetricContractor } from 'interfaces/metricContractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractors: IMetricContractor[] | IContractor[] | null;
  error: AxiosError | null;
  total: number | null;
}>;

export const initialState: State = {
  isFetching: false,
  contractors: null,
  error: null,
  total: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_SUCCESS':
      return {
        isFetching: false,
        contractors: action.payload,
        error: null,
        total: action.total
      };
    case 'FETCH_AUTOCOMPLETE_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
