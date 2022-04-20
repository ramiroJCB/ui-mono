import { Actions as FetchClientIncidentCategoriesActions } from './actions/fetchClientIncidentCategories';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncidentCategory } from 'interfaces/incidentCategory';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidentCategories: IIncidentCategory[] | null;
  clientId: string | null;
  error: AxiosError | null;
}>;

type Actions = FetchClientIncidentCategoriesActions;

export const initialState: State = {
  isFetching: false,
  incidentCategories: null,
  clientId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CLIENT_INCIDENT_CATEGORIES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_CLIENT_INCIDENT_CATEGORIES_SUCCESS':
      return {
        isFetching: false,
        incidentCategories: action.payload,
        clientId: action.clientId,
        error: null
      };
    case 'FETCH_CLIENT_INCIDENT_CATEGORIES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
