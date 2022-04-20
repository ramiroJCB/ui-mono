import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractor } from 'interfaces/contractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractor: IContractor | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  contractor: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_SUCCESS':
      return {
        isFetching: false,
        contractor: action.payload,
        error: null
      };
    case 'FETCH_CONTRACTOR_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
