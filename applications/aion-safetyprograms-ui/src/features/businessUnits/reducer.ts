import { Actions } from './actions/fetchBusinessUnits';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IBusinessUnit } from 'interfaces/businessUnit';

export type State = DeepReadonly<{
  isFetching: boolean;
  businessUnits: IBusinessUnit[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  businessUnits: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_BUSINESS_UNITS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_BUSINESS_UNITS_SUCCESS':
      return {
        isFetching: false,
        businessUnits: action.payload,
        error: null
      };
    case 'FETCH_BUSINESS_UNITS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
