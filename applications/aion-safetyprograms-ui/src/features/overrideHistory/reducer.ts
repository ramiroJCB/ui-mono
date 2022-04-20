import { Actions } from './actions/fetchOverrideHistory';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOverrideHistory } from 'interfaces/overrideHistory';

export type State = DeepReadonly<{
  isFetching: boolean;
  overrideHistory: IOverrideHistory[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  overrideHistory: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OVERRIDE_HISTORY_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_OVERRIDE_HISTORY_SUCCESS':
      return {
        ...state,
        total: action.total,
        isFetching: false,
        overrideHistory: action.payload,
        error: null
      };
    case 'FETCH_OVERRIDE_HISTORY_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
