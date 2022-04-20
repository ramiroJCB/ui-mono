import { Actions as FetchCertificationsActions } from './actions';
import { Actions as AddCertificationActions } from '../certification/actions/addCertification';
import { Actions as DeleteCertificationActions } from '../certification/actions/deleteCertification';
import { Actions as EditCertificationActions } from '../certification/actions/editCertification';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ICertification } from 'interfaces/certification';

export type State = DeepReadonly<{
  isFetching: boolean;
  certifications: ICertification[];
  error: AxiosError | null;
}>;

type Actions =
  | FetchCertificationsActions
  | AddCertificationActions
  | EditCertificationActions
  | DeleteCertificationActions;

export const initialState: State = {
  isFetching: false,
  certifications: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CERTIFICATIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CERTIFICATIONS_SUCCESS':
      return {
        isFetching: false,
        certifications: action.payload,
        error: null
      };
    case 'ADD_CERTIFICATION_SUCCESS':
      return {
        ...state,
        certifications: [action.payload, ...state.certifications].sort((a, b) => a.name.localeCompare(b.name))
      };
    case 'EDIT_CERTIFICATION_SUCCESS':
      return {
        ...state,
        certifications: state.certifications.map(certification =>
          certification.id === action.payload.id ? action.payload : certification
        )
      };
    case 'DELETE_CERTIFICATION_SUCCESS':
      return {
        ...state,
        certifications: state.certifications.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_CERTIFICATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
