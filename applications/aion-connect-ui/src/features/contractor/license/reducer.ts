import { Actions as AddLicenseActions } from './actions/addLicense';
import { Actions as DeleteLicenseActions } from './actions/deleteLicense';
import { Actions as EditLicenseActions } from './actions/editLicense';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ILicense } from 'interfaces/license';

export type State = DeepReadonly<{
  isFetching: boolean;
  license: ILicense | null;
  error: AxiosError | null;
}>;

type Actions = AddLicenseActions | EditLicenseActions | DeleteLicenseActions;

export const initialState: State = {
  isFetching: false,
  license: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_LICENSE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_LICENSE_SUCCESS':
    case 'EDIT_LICENSE_SUCCESS':
      return {
        isFetching: false,
        license: action.payload,
        error: null
      };
    case 'DELETE_LICENSE_SUCCESS':
      return {
        isFetching: false,
        license: null,
        error: null
      };
    case 'ADD_LICENSE_FAILURE':
    case 'EDIT_LICENSE_FAILURE':
    case 'DELETE_LICENSE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
