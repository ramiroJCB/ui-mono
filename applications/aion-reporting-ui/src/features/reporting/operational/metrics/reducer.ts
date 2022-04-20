import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOperationalMetric } from 'interfaces/operationalMetric';

export type State = DeepReadonly<{
  isFetching: boolean;
  operationalMetrics: IOperationalMetric[] | null;
  periodId: string | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  operationalMetrics: null,
  periodId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OPERATIONAL_METRICS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_OPERATIONAL_METRICS_SUCCESS':
      return {
        isFetching: false,
        operationalMetrics: action.payload,
        periodId: action.periodId,
        error: null
      };
    case 'FETCH_OPERATIONAL_METRICS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
