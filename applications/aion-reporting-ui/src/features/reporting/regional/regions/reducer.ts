import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegion } from 'interfaces/region';

export type State = DeepReadonly<{
  isFetching: boolean;
  regions: IRegion[] | null;
  periodId: string | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  regions: null,
  periodId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONS_SUCCESS':
      return {
        isFetching: false,
        regions: action.payload,
        periodId: action.periodId,
        error: null
      };
    case 'FETCH_REGIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
