import { Actions as FetchClientIncidentTypesActions } from './actions/fetchClientIncidentTypes';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentType } from 'interfaces/incidentType';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentTypes: IIncidentType[] | null;
  clientId: string | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentTypesActions;

export const initialState: State = {
  isFetching: false,
  incidentTypes: null,
  clientId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_TYPES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_TYPES_SUCCESS':
      return {
        isFetching: false,
        incidentTypes: action.payload,
        clientId: action.clientId,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_TYPES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
