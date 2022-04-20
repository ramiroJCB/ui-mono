import * as actionTypes from '../actionTypes';
import { RootActions } from 'combineActions';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { AxiosError } from 'axios';
import { IPECEmployee } from 'interfaces/PECEmployee';

export type State = {
  readonly PECId: string | null;
  readonly verisourceEmployee: IVerisourceEmployee | null;
  readonly isFetching: boolean;
  readonly error: AxiosError | null;
  readonly linkResult: IPECEmployee | null;
};

export const initialState: State = {
  PECId: null,
  verisourceEmployee: null,
  isFetching: false,
  error: null,
  linkResult: null
};

export function reducer(state: State = initialState, action: RootActions): State {
  switch (action.type) {
    case actionTypes.LINK_EMPLOYEES:
      return {
        ...state,
        PECId: action.payload.PECId,
        verisourceEmployee: action.payload.verisourceEmployee,
        linkResult: null,
        error: null
      };

    case actionTypes.CANCEL_LINK_EMPLOYEES:
      return {
        ...state,
        PECId: null,
        verisourceEmployee: null
      };

    case actionTypes.LINK_EMPLOYEES_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case actionTypes.LINK_EMPLOYEES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    case actionTypes.LINK_EMPLOYEES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
        linkResult: action.payload.value
      };

    default:
      return state;
  }
}
