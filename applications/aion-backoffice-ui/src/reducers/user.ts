import { Actions } from 'actions/user';
import { AxiosError } from 'axios';
import { IUser } from 'interfaces/user';

export type State = {
  readonly isFetching: boolean;
  readonly user: IUser | null;
  readonly error: AxiosError | Error | null;
};

const initialState: State = {
  isFetching: false,
  user: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        isFetching: false,
        user: action.payload,
        error: null
      };
    case 'FETCH_USER_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
