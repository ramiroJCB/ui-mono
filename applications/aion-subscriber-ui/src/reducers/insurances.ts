import { Actions } from 'actions/insurances';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IInsurance } from 'interfaces/insurance';

export type State = DeepReadonly<{
  isFetching: boolean;
  insurances: IInsurance[] | null;
  error: AxiosError | null;
}>;

const initialState: State = {
  isFetching: false,
  insurances: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INSURANCES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_INSURANCES_SUCCESS':
      return {
        isFetching: false,
        insurances: action.payload,
        error: null
      };
    case 'FETCH_INSURANCES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
