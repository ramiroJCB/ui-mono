import { Actions as FetchClientIncidentTypeActions } from './actions/fetchClientIncidentType';
import { Actions as AddClientIncidentTypeActions } from './actions/addClientIncidentType';
import { Actions as UpdateClientIncidentTypeActions } from './actions/updateClientIncidentType';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentType } from 'interfaces/incidentType';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentType: IIncidentType | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentTypeActions | AddClientIncidentTypeActions | UpdateClientIncidentTypeActions;

export const initialState: State = {
  isFetching: false,
  incidentType: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_TYPE_REQUEST':
    case 'ADD_CLIENT_INCIDENT_TYPE_REQUEST':
    case 'UPDATE_CLIENT_INCIDENT_TYPE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_TYPE_SUCCESS':
    case 'ADD_CLIENT_INCIDENT_TYPE_SUCCESS':
    case 'UPDATE_CLIENT_INCIDENT_TYPE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        incidentType: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_TYPE_FAILURE':
    case 'ADD_CLIENT_INCIDENT_TYPE_FAILURE':
    case 'UPDATE_CLIENT_INCIDENT_TYPE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
