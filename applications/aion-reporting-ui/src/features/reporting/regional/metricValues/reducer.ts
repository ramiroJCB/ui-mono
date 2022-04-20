import { Actions as FetchMetricValuesActions } from './actions/fetchRegionalMetricValues';
import { Actions as UpdateMetricValueActions } from './actions/updateRegionalMetricValue';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalMetricValue } from 'interfaces/regionalMetricValue';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalMetricValues: IRegionalMetricValue[] | null;
  error: AxiosError | null;
}>;

type Actions = FetchMetricValuesActions | UpdateMetricValueActions;

export const initialState: State = {
  isFetching: false,
  regionalMetricValues: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_METRIC_VALUES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'UPDATE_REGIONAL_METRIC_VALUE_REQUEST':
      return {
        ...state
      };
    case 'FETCH_REGIONAL_METRIC_VALUES_SUCCESS':
      return {
        isFetching: false,
        regionalMetricValues: action.payload,
        error: null
      };
    case 'UPDATE_REGIONAL_METRIC_VALUE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case 'FETCH_REGIONAL_METRIC_VALUES_FAILURE':
    case 'UPDATE_REGIONAL_METRIC_VALUE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
