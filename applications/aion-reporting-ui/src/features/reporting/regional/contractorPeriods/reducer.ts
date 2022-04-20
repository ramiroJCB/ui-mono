import { Actions as FetchRegionalContractorPeriodsActions } from './actions/fetchRegionalContractorPeriods';
import { Actions as UpdateContractorPeriodStatusActions } from './actions/updateRegionalContractorPeriodStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContractorPeriod } from 'interfaces/contractorPeriod';

export type State = DeepReadonly<{
  isFetching: boolean;
  periods: IContractorPeriod[] | null;
  error: AxiosError | null;
}>;

type Actions = FetchRegionalContractorPeriodsActions | UpdateContractorPeriodStatusActions;

export const initialState: State = {
  isFetching: false,
  periods: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_CONTRACTOR_PERIODS_REQUEST':
    case 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONAL_CONTRACTOR_PERIODS_SUCCESS':
      return {
        isFetching: false,
        periods: action.payload,
        error: null
      };
    case 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_SUCCESS':
      return {
        isFetching: false,
        periods: state.periods && state.periods.map(p => (p.id === action.payload.id ? action.payload : p)),
        error: null
      };
    case 'FETCH_REGIONAL_CONTRACTOR_PERIODS_FAILURE':
    case 'UPDATE_REGIONAL_CONTRACTOR_PERIOD_STATUS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
