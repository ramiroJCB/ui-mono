import { Actions } from 'actions/sites';
import { AxiosError } from 'axios';
import { ISite, SiteStatus } from 'interfaces/site';
import { SiteActions } from 'combineActions';
import { DeepReadonly } from 'utility-types';

const { Active } = SiteStatus;

export type State = DeepReadonly<{
  isFetching: boolean;
  sites: ISite[] | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  sites: null,
  error: null
};

const sortComparator = (a: ISite, b: ISite) =>
  Number(b.status === Active) - Number(a.status === Active) || a.name.localeCompare(b.name);

export function reducer(state: State = initialState, action: Actions | SiteActions): State {
  switch (action.type) {
    case 'FETCH_SITES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_SITES_SUCCESS':
      return {
        isFetching: false,
        sites: action.payload.sort(sortComparator),
        error: null
      };
    case 'FETCH_SITES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_SITE_SUCCESS':
      return {
        ...state,
        sites: state.sites && [...state.sites, action.payload].sort(sortComparator)
      };
    case 'DELETE_SITE_SUCCESS':
      return {
        ...state,
        sites: state.sites && state.sites.filter(({ id }) => id !== action.siteId)
      };
    case 'UPDATE_SITE_SUCCESS':
      return {
        ...state,
        sites:
          state.sites && state.sites.map(p => (p.id === action.payload.id ? action.payload : p)).sort(sortComparator)
      };
    default:
      return state;
  }
}
