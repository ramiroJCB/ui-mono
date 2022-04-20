import { Actions } from './actions/fetchSafetyPrograms';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ISafetyProgram } from 'interfaces/safetyProgram';

export type State = DeepReadonly<{
  isFetching: boolean;
  safetyPrograms: ISafetyProgram[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  safetyPrograms: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_SAFETY_PROGRAMS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAMS_SUCCESS':
      return {
        isFetching: false,
        safetyPrograms: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAMS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
