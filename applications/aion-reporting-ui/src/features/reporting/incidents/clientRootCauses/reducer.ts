import { Actions as FetchClientIncidentRootCausesActions } from './actions/fetchClientIncidentRootCauses';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentRootCauses: IIncidentRootCause[] | null;
  clientId: string | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentRootCausesActions;

export const initialState: State = {
  isFetching: false,
  incidentRootCauses: null,
  clientId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_SUCCESS':
      return {
        isFetching: false,
        incidentRootCauses: action.payload,
        clientId: action.clientId,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_ROOT_CAUSES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
