import { Actions } from './actions/fetchRegionalServices';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalService } from 'interfaces/regionalService';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalServices: IRegionalService[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  regionalServices: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REGIONAL_SERVICES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_REGIONAL_SERVICES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        regionalServices: action.payload,
        error: null
      };
    case 'FETCH_REGIONAL_SERVICES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
