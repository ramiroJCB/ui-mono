import { Actions as FetchClientIncidentRegionsActions } from './actions/fetchClientIncidentRegions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentRegion } from 'interfaces/incidentRegion';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentRegions: IIncidentRegion[] | null;
  clientId: string | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentRegionsActions;

export const initialState: State = {
  isFetching: false,
  incidentRegions: null,
  clientId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_REGIONS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_REGIONS_SUCCESS':
      return {
        isFetching: false,
        incidentRegions: action.payload,
        clientId: action.clientId,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_REGIONS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
