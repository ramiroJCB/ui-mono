import { Actions as FetchOfficeLocationsActions } from './actions';
import { Actions as AddOfficeLocationActions } from '../officeLocation/actions/addOfficeLocation';
import { Actions as DeleteOfficeLocationActions } from '../officeLocation/actions/deleteOfficeLocation';
import { Actions as EditOfficeLocationActions } from '../officeLocation/actions/editOfficeLocation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IOfficeLocation } from 'interfaces/officeLocation';

export type State = DeepReadonly<{
  isFetching: boolean;
  officeLocations: IOfficeLocation[];
  error: AxiosError | null;
}>;

type Actions =
  | FetchOfficeLocationsActions
  | AddOfficeLocationActions
  | EditOfficeLocationActions
  | DeleteOfficeLocationActions;

export const initialState: State = {
  isFetching: false,
  officeLocations: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OFFICE_LOCATIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_OFFICE_LOCATIONS_SUCCESS':
      return {
        isFetching: false,
        officeLocations: action.payload,
        error: null
      };
    case 'ADD_OFFICE_LOCATION_SUCCESS':
      return {
        ...state,
        officeLocations: [action.payload, ...state.officeLocations].sort(
          (a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name)
        )
      };
    case 'EDIT_OFFICE_LOCATION_SUCCESS':
      return {
        ...state,
        officeLocations: state.officeLocations
          .map(officeLocation => (officeLocation.id === action.payload.id ? action.payload : officeLocation))
          .sort((a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name))
      };
    case 'DELETE_OFFICE_LOCATION_SUCCESS':
      return {
        ...state,
        officeLocations: state.officeLocations.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_OFFICE_LOCATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
