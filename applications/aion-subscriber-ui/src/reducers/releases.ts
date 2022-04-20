import { Actions } from 'actions/releases';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRelease } from 'interfaces/release';

export type State = DeepReadonly<{
  isFetching: boolean;
  releases: IRelease[] | null;
  error: AxiosError | null;
}>;

const initialState: State = {
  isFetching: false,
  releases: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_RELEASES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_RELEASES_SUCCESS':
      return {
        isFetching: false,
        releases: action.payload,
        error: null
      };
    case 'FETCH_RELEASES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
