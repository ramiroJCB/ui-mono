import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncident } from 'interfaces/incident';

export type State = DeepReadonly<{
  isFetching: boolean;
  incident: IIncident | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  incident: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_INCIDENT_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_INCIDENT_SUCCESS':
      return {
        isFetching: false,
        incident: action.payload,
        error: null
      };
    case 'ADD_INCIDENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
