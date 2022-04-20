import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IMappedRegionMetrics } from 'interfaces/mappedRegionMetrics';

export type State = DeepReadonly<{
  [contractorId: string]: {
    isFetching: boolean;
    regionMetrics: IMappedRegionMetrics[] | null;
    search: string | null;
    periodId: string | null;
    error: AxiosError | null;
  };
}>;

export const initialState: State = {};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_REQUEST':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: true,
          regionMetrics: null,
          search: null,
          periodId: null,
          error: null
        }
      };
    case 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_SUCCESS':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: false,
          regionMetrics: action.payload,
          search: action.search,
          periodId: action.periodId,
          error: null
        }
      };
    case 'FETCH_REGIONAL_METRIC_VALUES_BY_CONTRACTOR_FAILURE':
      return {
        ...state,
        [action.contractorId]: {
          ...state[action.contractorId],
          isFetching: false,
          regionMetrics: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
