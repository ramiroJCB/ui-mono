import { Actions as AddCertificationActions } from './actions/addCertification';
import { Actions as DeleteCertificationActions } from './actions/deleteCertification';
import { Actions as EditCertificationActions } from './actions/editCertification';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ICertification } from 'interfaces/certification';

export type State = DeepReadonly<{
  isFetching: boolean;
  certification: ICertification | null;
  error: AxiosError | null;
}>;

type Actions = AddCertificationActions | EditCertificationActions | DeleteCertificationActions;

export const initialState: State = {
  isFetching: false,
  certification: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_CERTIFICATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_CERTIFICATION_SUCCESS':
    case 'EDIT_CERTIFICATION_SUCCESS':
      return {
        isFetching: false,
        certification: action.payload,
        error: null
      };
    case 'DELETE_CERTIFICATION_SUCCESS':
      return {
        isFetching: false,
        certification: null,
        error: null
      };
    case 'ADD_CERTIFICATION_FAILURE':
    case 'EDIT_CERTIFICATION_FAILURE':
    case 'DELETE_CERTIFICATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
