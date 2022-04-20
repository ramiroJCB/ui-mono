import { Actions as FetchLicensesActions } from './actions';
import { Actions as AddLicenseActions } from '../license/actions/addLicense';
import { Actions as DeleteLicenseActions } from '../license/actions/deleteLicense';
import { Actions as EditLicenseActions } from '../license/actions/editLicense';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ILicense } from 'interfaces/license';

export type State = DeepReadonly<{
  isFetching: boolean;
  licenses: ILicense[];
  error: AxiosError | null;
}>;

type Actions = FetchLicensesActions | AddLicenseActions | EditLicenseActions | DeleteLicenseActions;

export const initialState: State = {
  isFetching: false,
  licenses: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_LICENSES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_LICENSES_SUCCESS':
      return {
        isFetching: false,
        licenses: action.payload,
        error: null
      };
    case 'ADD_LICENSE_SUCCESS':
      return {
        ...state,
        licenses: [action.payload, ...state.licenses].sort((a, b) => a.name.localeCompare(b.name))
      };
    case 'EDIT_LICENSE_SUCCESS':
      return {
        ...state,
        licenses: state.licenses.map(license => (license.id === action.payload.id ? action.payload : license))
      };
    case 'DELETE_LICENSE_SUCCESS':
      return {
        ...state,
        licenses: state.licenses.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_LICENSES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
