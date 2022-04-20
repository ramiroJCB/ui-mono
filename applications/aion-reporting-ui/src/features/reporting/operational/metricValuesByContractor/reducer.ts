import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IMappedMetric } from 'interfaces/mappedMetric';

export type State = DeepReadonly<{
  [contractorId: string]: {
    isFetching: boolean;
    operationalMetrics: IMappedMetric[] | null;
    search: string | null;
    periodId: string | null;
    error: AxiosError | null;
  };
}>;

export const initialState: State = {};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_REQUEST':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: true,
          operationalMetrics: null,
          search: null,
          periodId: null,
          error: null
        }
      };
    case 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_SUCCESS':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: false,
          operationalMetrics: action.payload,
          search: action.search,
          periodId: action.periodId,
          error: null
        }
      };
    case 'FETCH_OPERATIONAL_METRIC_VALUES_BY_CONTRACTOR_FAILURE':
      return {
        ...state,
        [action.contractorId]: {
          ...state[action.contractorId],
          isFetching: false,
          operationalMetrics: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
