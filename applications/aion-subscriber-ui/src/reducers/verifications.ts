import { Actions } from 'actions/verifications';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IVerification } from 'interfaces/verification';

export type State = DeepReadonly<{
  isFetching: boolean;
  verifications: IVerification[] | null;
  error: AxiosError | null;
}>;

const initialState: State = {
  isFetching: false,
  verifications: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_VERIFICATIONS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_VERIFICATIONS_SUCCESS':
      return {
        isFetching: false,
        verifications: action.payload,
        error: null
      };
    case 'FETCH_VERIFICATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
