import { Actions } from './actions/fetchFilters';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IClient } from 'interfaces/client';
import { IContractor } from 'interfaces/contractor';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { ClientOverrideStatus } from 'interfaces/requirementOverride';

export type State = DeepReadonly<{
  isFetching: boolean;
  filters: {
    clients: IClient[];
    contractors: IContractor[];
    safetyPrograms: ISafetyProgram[];
    overrideStatuses: {
      value: ClientOverrideStatus;
      label: string;
    }[];
  } | null;

  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  filters: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_FILTERS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_FILTERS_SUCCESS':
      return {
        isFetching: false,
        filters: action.payload,
        error: null
      };
    case 'FETCH_FILTERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
