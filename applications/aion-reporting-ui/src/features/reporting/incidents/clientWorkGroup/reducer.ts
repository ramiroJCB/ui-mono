import { Actions as FetchClientIncidentWorkGroupActions } from './actions/fetchClientIncidentWorkGroup';
import { Actions as AddClientIncidentWorkGroupActions } from './actions/addClientIncidentWorkGroup';
import { Actions as UpdateClientIncidentWorkGroupActions } from './actions/updateClientIncidentWorkGroup';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentWorkGroup: IIncidentWorkGroup | null;
  error: AxiosError | null;
}>;

type Actions =
  | FetchClientIncidentWorkGroupActions
  | AddClientIncidentWorkGroupActions
  | UpdateClientIncidentWorkGroupActions;

export const initialState: State = {
  isFetching: false,
  incidentWorkGroup: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_WORKGROUP_REQUEST':
    case 'ADD_CLIENT_INCIDENT_WORKGROUP_REQUEST':
    case 'UPDATE_CLIENT_INCIDENT_WORKGROUP_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_WORKGROUP_SUCCESS':
    case 'ADD_CLIENT_INCIDENT_WORKGROUP_SUCCESS':
    case 'UPDATE_CLIENT_INCIDENT_WORKGROUP_SUCCESS':
      return {
        ...state,
        isFetching: false,
        incidentWorkGroup: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_WORKGROUP_FAILURE':
    case 'ADD_CLIENT_INCIDENT_WORKGROUP_FAILURE':
    case 'UPDATE_CLIENT_INCIDENT_WORKGROUP_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
