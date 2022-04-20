import { Actions as FetchRegionalReportOptionsActions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalReportOption } from 'interfaces/regionalReportOption';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalReportOptions: IRegionalReportOption[] | null;
  error: AxiosError | null;
}>;

type Actions = FetchRegionalReportOptionsActions;

export const initialState: State = {
  isFetching: false,
  regionalReportOptions: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_REPORT_OPTIONS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONAL_REPORT_OPTIONS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        regionalReportOptions: action.payload,
        error: null
      };
    case 'FETCH_REGIONAL_REPORT_OPTIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
