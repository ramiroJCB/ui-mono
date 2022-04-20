import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegion } from 'interfaces/region';

export type State = DeepReadonly<{
  [contractorId: string]: {
    isFetching: boolean;
    regions: IRegion[] | null;
    periodId: string | null;
    error: AxiosError | null;
  };
}>;

export const initialState: State = {};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_REQUEST':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: true,
          regions: null,
          periodId: null,
          error: null
        }
      };
    case 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_SUCCESS':
      return {
        ...state,
        [action.contractorId]: {
          isFetching: false,
          regions: action.payload,
          periodId: action.periodId,
          error: null
        }
      };
    case 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_FAILURE':
      return {
        ...state,
        [action.contractorId]: {
          ...state[action.contractorId],
          isFetching: false,
          regions: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
