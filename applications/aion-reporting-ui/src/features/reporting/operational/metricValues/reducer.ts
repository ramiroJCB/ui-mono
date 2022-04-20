import { Actions as FetchOperationalMetricValuesActions } from './actions/fetchOperationalMetricValues';
import { Actions as UpdateOperationalMetricValueActions } from './actions/updateOperationalMetricValue';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOperationalMetricValue } from 'interfaces/operationalMetricValue';

export type State = DeepReadonly<{
  isFetching: boolean;
  operationalMetricValues: IOperationalMetricValue[] | null;
  error: AxiosError | null;
}>;

type Actions = FetchOperationalMetricValuesActions | UpdateOperationalMetricValueActions;

export const initialState: State = {
  isFetching: false,
  operationalMetricValues: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OPERATIONAL_METRIC_VALUES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'UPDATE_OPERATIONAL_METRIC_VALUE_REQUEST':
      return {
        ...state
      };
    case 'FETCH_OPERATIONAL_METRIC_VALUES_SUCCESS':
      return {
        isFetching: false,
        operationalMetricValues: action.payload,
        error: null
      };
    case 'UPDATE_OPERATIONAL_METRIC_VALUE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case 'FETCH_OPERATIONAL_METRIC_VALUES_FAILURE':
    case 'UPDATE_OPERATIONAL_METRIC_VALUE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
