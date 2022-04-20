import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalMetric } from 'interfaces/regionalMetric';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalMetrics: IRegionalMetric[] | null;
  periodId: string | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  regionalMetrics: null,
  periodId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_METRICS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONAL_METRICS_SUCCESS':
      return {
        isFetching: false,
        regionalMetrics: action.payload,
        periodId: action.periodId,
        error: null
      };
    case 'FETCH_REGIONAL_METRICS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
