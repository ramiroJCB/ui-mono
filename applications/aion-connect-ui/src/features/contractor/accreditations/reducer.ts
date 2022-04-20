import { Actions as FetchAccreditationsActions } from './actions';
import { Actions as AddAccreditationActions } from '../accreditation/actions/addAccreditation';
import { Actions as DeleteAccreditationActions } from '../accreditation/actions/deleteAccreditation';
import { Actions as EditAccreditationActions } from '../accreditation/actions/editAccreditation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IAccreditation } from 'interfaces/accreditation';

export type State = DeepReadonly<{
  isFetching: boolean;
  accreditations: IAccreditation[];
  error: AxiosError | null;
}>;

type Actions =
  | FetchAccreditationsActions
  | AddAccreditationActions
  | EditAccreditationActions
  | DeleteAccreditationActions;

export const initialState: State = {
  isFetching: false,
  accreditations: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ACCREDITATIONS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_ACCREDITATIONS_SUCCESS':
      return {
        isFetching: false,
        accreditations: action.payload,
        error: null
      };
    case 'ADD_ACCREDITATION_SUCCESS':
      return {
        ...state,
        accreditations: [action.payload, ...state.accreditations].sort((a, b) => a.name.localeCompare(b.name))
      };
    case 'EDIT_ACCREDITATION_SUCCESS':
      return {
        ...state,
        accreditations: state.accreditations.map(accreditation =>
          accreditation.id === action.payload.id ? action.payload : accreditation
        )
      };
    case 'DELETE_ACCREDITATION_SUCCESS':
      return {
        ...state,
        accreditations: state.accreditations.filter(({ id }) => id !== action.payload)
      };
    case 'FETCH_ACCREDITATIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
