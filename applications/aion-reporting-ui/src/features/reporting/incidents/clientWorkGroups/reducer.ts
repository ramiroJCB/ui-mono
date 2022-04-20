import { Actions as FetchClientIncidentWorkGroupsActions } from './actions/fetchClientIncidentWorkGroups';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentWorkGroups: IIncidentWorkGroup[] | null;
  clientId: string | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentWorkGroupsActions;

export const initialState: State = {
  isFetching: false,
  incidentWorkGroups: null,
  clientId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_WORKGROUPS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_WORKGROUPS_SUCCESS':
      return {
        isFetching: false,
        incidentWorkGroups: action.payload,
        clientId: action.clientId,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_WORKGROUPS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
