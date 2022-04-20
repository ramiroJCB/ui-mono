import { AxiosError } from 'axios';
import { ContactActions, SiteActions as Action, WorkerActions } from 'combineActions';
import { ISite } from 'interfaces/site';
import { IWorker } from 'interfaces/worker';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  isDeleting: boolean;
  site: ISite | null;
  error: AxiosError | null;
  workers: IWorker[] | null;
}>;

export const initialState: State = {
  isFetching: false,
  isDeleting: false,
  site: null,
  error: null,
  workers: null
};

export function reducer(state: State = initialState, action: Action | ContactActions | WorkerActions): State {
  switch (action.type) {
    case 'FETCH_SITE_REQUEST':
    case 'ADD_SITE_REQUEST':
    case 'UPDATE_SITE_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'DELETE_SITE_REQUEST':
      return {
        ...state,
        isDeleting: true
      };
    case 'FETCH_SITE_SUCCESS':
    case 'ADD_SITE_SUCCESS':
    case 'UPDATE_SITE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        site: action.payload,
        error: null
      };
    case 'DELETE_SITE_SUCCESS':
      return {
        isFetching: false,
        isDeleting: false,
        site: null,
        error: null,
        workers: null
      };
    case 'FETCH_SITE_FAILURE':
    case 'ADD_SITE_FAILURE':
    case 'UPDATE_SITE_FAILURE':
    case 'DELETE_SITE_FAILURE':
      return {
        ...state,
        isFetching: false,
        isDeleting: false,
        error: action.error
      };
    case 'ADD_CONTACT_SUCCESS':
      return {
        ...state,
        site: state.site && {
          ...state.site,
          numContacts: state.site.numContacts + 1
        }
      };
    case 'DELETE_CONTACT_SUCCESS':
      return {
        ...state,
        site: state.site && {
          ...state.site,
          numContacts: state.site.numContacts - 1
        }
      };
    case 'UPDATE_WORKER_SUCCESS':
      return {
        ...state,
        site: state.site && {
          ...state.site,
          numWorkersOnSite: state.site.numWorkersOnSite + action.workersOffset
        }
      };
    default:
      return state;
  }
}
