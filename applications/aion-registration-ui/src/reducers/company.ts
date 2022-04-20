import { AxiosError } from 'axios';
import { CompanyActions as Actions } from '../combineActions';
import { ICompany } from '../interfaces/company';

export const ADD_COMPANY_REQUEST = 'ADD_COMPANY_REQUEST';
export const ADD_COMPANY_SUCCESS = 'ADD_COMPANY_SUCCESS';
export const ADD_COMPANY_FAILURE = 'ADD_COMPANY_FAILURE';
export const MATCH_COMPANY_SUCCESS = 'MATCH_COMPANY_SUCCESS';

export type State = {
  readonly isFetching: boolean;
  readonly company: ICompany | null;
  readonly error: AxiosError | null;
};

const initialState: State = {
  isFetching: false,
  company: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case ADD_COMPANY_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ADD_COMPANY_SUCCESS:
    case MATCH_COMPANY_SUCCESS:
      return {
        isFetching: false,
        company: action.payload,
        error: null
      };
    case ADD_COMPANY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
