import { Actions as FetchClientIncidentCategoryActions } from './actions/fetchClientIncidentCategory';
import { Actions as AddClientIncidentCategoryActions } from './actions/addClientIncidentCategory';
import { Actions as UpdateClientIncidentCategoryActions } from './actions/updateClientIncidentCategory';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentCategory } from 'interfaces/incidentCategory';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentCategory: IIncidentCategory | null;
  error: AxiosError | null;
}>;

type Actions =
  | FetchClientIncidentCategoryActions
  | AddClientIncidentCategoryActions
  | UpdateClientIncidentCategoryActions;

export const initialState: State = {
  isFetching: false,
  incidentCategory: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_CATEGORY_REQUEST':
    case 'ADD_CLIENT_INCIDENT_CATEGORY_REQUEST':
    case 'UPDATE_CLIENT_INCIDENT_CATEGORY_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_CATEGORY_SUCCESS':
    case 'ADD_CLIENT_INCIDENT_CATEGORY_SUCCESS':
    case 'UPDATE_CLIENT_INCIDENT_CATEGORY_SUCCESS':
      return {
        ...state,
        isFetching: false,
        incidentCategory: action.payload,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_CATEGORY_FAILURE':
    case 'ADD_CLIENT_INCIDENT_CATEGORY_FAILURE':
    case 'UPDATE_CLIENT_INCIDENT_CATEGORY_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
