import { Actions as AddAccreditationActions } from './actions/addAccreditation';
import { Actions as DeleteAccreditationActions } from './actions/deleteAccreditation';
import { Actions as EditAccreditationActions } from './actions/editAccreditation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IAccreditation } from 'interfaces/accreditation';

export type State = DeepReadonly<{
  isFetching: boolean;
  accreditation: IAccreditation | null;
  error: AxiosError | null;
}>;

type Actions = AddAccreditationActions | EditAccreditationActions | DeleteAccreditationActions;

export const initialState: State = {
  isFetching: false,
  accreditation: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_ACCREDITATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_ACCREDITATION_SUCCESS':
    case 'EDIT_ACCREDITATION_SUCCESS':
      return {
        isFetching: false,
        accreditation: action.payload,
        error: null
      };
    case 'DELETE_ACCREDITATION_SUCCESS':
      return {
        isFetching: false,
        accreditation: null,
        error: null
      };
    case 'ADD_ACCREDITATION_FAILURE':
    case 'EDIT_ACCREDITATION_FAILURE':
    case 'DELETE_ACCREDITATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
