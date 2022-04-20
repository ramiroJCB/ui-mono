import * as actionTypes from '../actionTypes';
import { RootActions } from 'combineActions';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { AxiosError } from 'axios';

export type State = {
  readonly isFetching: boolean;
  readonly employees: IPECEmployee[];
  readonly count: number;
  readonly error: AxiosError | null;
};

export const initialState: State = {
  isFetching: false,
  employees: [],
  count: 0,
  error: null
};

export function reducer(state: State = initialState, action: RootActions): State {
  switch (action.type) {
    case actionTypes.FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.FETCH_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        employees: action.payload.value.map(e => ({ ...e, origin: 'PEC' })),
        count: action.payload.count,
        error: null
      };
    }
    case actionTypes.FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    default:
      return state;
  }
}
