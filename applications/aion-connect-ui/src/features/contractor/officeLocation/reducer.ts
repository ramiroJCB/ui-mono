import { Actions as AddOfficeLocationActions } from './actions/addOfficeLocation';
import { Actions as DeleteOfficeLocationActions } from './actions/deleteOfficeLocation';
import { Actions as EditOfficeLocationActions } from './actions/editOfficeLocation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOfficeLocation } from 'interfaces/officeLocation';

export type State = DeepReadonly<{
  isFetching: boolean;
  officeLocation: IOfficeLocation | null;
  error: AxiosError | null;
}>;

type Actions = AddOfficeLocationActions | EditOfficeLocationActions | DeleteOfficeLocationActions;

export const initialState: State = {
  isFetching: false,
  officeLocation: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_OFFICE_LOCATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_OFFICE_LOCATION_SUCCESS':
    case 'EDIT_OFFICE_LOCATION_SUCCESS':
      return {
        isFetching: false,
        officeLocation: action.payload,
        error: null
      };
    case 'DELETE_OFFICE_LOCATION_SUCCESS':
      return {
        isFetching: false,
        officeLocation: null,
        error: null
      };
    case 'ADD_OFFICE_LOCATION_FAILURE':
    case 'EDIT_OFFICE_LOCATION_FAILURE':
    case 'DELETE_OFFICE_LOCATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
