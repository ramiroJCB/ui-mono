import { Actions as FetchClientIncidentRegionActions } from './actions/fetchClientIncidentRegion';
import { Actions as AddClientIncidentRegionActions } from './actions/addClientIncidentRegion';
import { Actions as UpdateClientIncidentRegionActions } from './actions/updateClientIncidentRegion';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentRegion } from 'interfaces/incidentRegion';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentRegion: IIncidentRegion | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentRegionActions | AddClientIncidentRegionActions | UpdateClientIncidentRegionActions;

export const initialState: State = {
  isFetching: false,
  incidentRegion: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_REGION_REQUEST':
    case 'ADD_CLIENT_INCIDENT_REGION_REQUEST':
    case 'UPDATE_CLIENT_INCIDENT_REGION_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_REGION_SUCCESS':
    case 'ADD_CLIENT_INCIDENT_REGION_SUCCESS':
    case 'UPDATE_CLIENT_INCIDENT_REGION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        incidentRegion: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_REGION_FAILURE':
    case 'ADD_CLIENT_INCIDENT_REGION_FAILURE':
    case 'UPDATE_CLIENT_INCIDENT_REGION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
