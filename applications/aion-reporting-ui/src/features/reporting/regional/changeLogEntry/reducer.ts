import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalChangeLogEntry } from 'interfaces/regionalChangeLogEntry';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalChangeLogEntry: IRegionalChangeLogEntry | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  regionalChangeLogEntry: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_REGIONAL_CHANGELOG_ENTRY_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_REGIONAL_CHANGELOG_ENTRY_SUCCESS':
      return {
        isFetching: false,
        regionalChangeLogEntry: action.payload,
        error: null
      };
    case 'ADD_REGIONAL_CHANGELOG_ENTRY_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
