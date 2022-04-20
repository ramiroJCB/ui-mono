import { Actions } from './actions/fetchMandates';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IExpandedMandate } from 'interfaces/mandate';

export type State = DeepReadonly<{
  isFetching: boolean;
  mandates: IExpandedMandate[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  mandates: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_MANDATES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_MANDATES_SUCCESS':
      return {
        isFetching: false,
        mandates: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_MANDATES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
