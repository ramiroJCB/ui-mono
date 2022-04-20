import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { Actions } from './actions/updateShopLinks';

export type State = DeepReadonly<{
  isFetching: boolean;
  safetyProgramIds: string[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  safetyProgramIds: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'UPDATE_SHOP_LINKS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'UPDATE_SHOP_LINKS_SUCCESS':
      return {
        isFetching: false,
        safetyProgramIds: action.payload,
        error: null
      };
    case 'UPDATE_SHOP_LINKS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
