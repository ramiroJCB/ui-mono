import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalChangeLogEntry } from 'interfaces/regionalChangeLogEntry';

export type State = DeepReadonly<{
  [contractorId: string]: {
    isFetching: boolean;
    regionalChangeLog: IRegionalChangeLogEntry[] | null;
    periodId: string | null;
    error: AxiosError | null;
  };
}>;

export const initialState: State = {};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_REQUEST':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: true,
          regionalChangeLog: null,
          periodId: null,
          error: null
        }
      };
    case 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_SUCCESS':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: false,
          regionalChangeLog: action.payload,
          periodId: action.periodId,
          error: null
        }
      };
    case 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_FAILURE':
      return {
        ...state,
        [action.contractorId]: {
          ...state[action.contractorId],
          isFetching: false,
          regionalChangeLog: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
