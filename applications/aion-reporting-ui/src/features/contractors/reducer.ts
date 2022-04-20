import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IContractor } from 'interfaces/contractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractors: IContractor[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  contractors: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CONTRACTORS_SUCCESS':
      return {
        isFetching: false,
        contractors: action.payload,
        error: null
      };
    case 'FETCH_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
