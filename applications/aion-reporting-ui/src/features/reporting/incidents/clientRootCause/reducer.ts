import { Actions as FetchClientIncidentRootCauseActions } from './actions/fetchClientIncidentRootCause';
import { Actions as AddClientIncidentRootCauseActions } from './actions/addClientIncidentRootCause';
import { Actions as UpdateClientIncidentRootCauseActions } from './actions/updateClientIncidentRootCause';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentRootCause: IIncidentRootCause | null;
  error: AxiosError | null;
}>;

type Actions =
  | FetchClientIncidentRootCauseActions
  | AddClientIncidentRootCauseActions
  | UpdateClientIncidentRootCauseActions;

export const initialState: State = {
  isFetching: false,
  incidentRootCause: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST':
    case 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST':
    case 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS':
    case 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS':
    case 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        incidentRootCause: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE':
    case 'ADD_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE':
    case 'UPDATE_CLIENT_INCIDENT_ROOT_CAUSE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
