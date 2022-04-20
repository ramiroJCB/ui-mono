import { Actions } from './actions/fetchClientServiceRegions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClientServiceRegion } from 'interfaces/clientServiceRegion';

export type State = DeepReadonly<{
  isFetching: boolean;
  clientServiceRegions: IClientServiceRegion[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  clientServiceRegions: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_SERVICE_REGIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CLIENT_SERVICE_REGIONS_SUCCESS':
      return {
        isFetching: false,
        clientServiceRegions: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_SERVICE_REGIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
