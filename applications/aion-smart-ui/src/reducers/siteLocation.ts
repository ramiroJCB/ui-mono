import { Actions } from 'actions/siteLocation';
import { AxiosError } from 'axios';
import { ISiteLocation } from 'interfaces/site';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  siteLocation: ISiteLocation | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  siteLocation: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CURRENT_LOCATION_REQUEST':
    case 'FETCH_SITE_LOCATION_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CURRENT_LOCATION_DONE':
      return {
        ...state,
        isFetching: false
      };
    case 'FETCH_SITE_LOCATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        siteLocation: action.payload
      };
    case 'FETCH_SITE_LOCATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'RESET_SITE_LOCATION':
      return initialState;
    default:
      return state;
  }
}
