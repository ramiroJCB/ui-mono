import { Actions } from './actions/fetchIncidentsByContractor';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IIncident } from 'interfaces/incident';

export type State = DeepReadonly<{
  isFetching: boolean;
  incidents: IIncident[] | null;
  error: AxiosError | null;
  totalCount: number;
}>;

export const initialState: State = {
  isFetching: false,
  incidents: null,
  error: null,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INCIDENTS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_INCIDENTS_SUCCESS':
      return {
        isFetching: false,
        incidents: action.payload,
        error: null,
        totalCount: action.totalCount
      };
    case 'FETCH_INCIDENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
