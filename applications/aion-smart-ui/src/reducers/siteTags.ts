import { Actions } from 'actions/siteTags';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ISiteTag } from 'interfaces/siteTag';
import { Actions as SelectTypeActions } from 'actions/selectTag';

export type State = DeepReadonly<{
  isFetching: boolean;
  siteTags: ISiteTag[] | null;
  error: AxiosError | null;
  selectedSiteTags: string[];
}>;

export const initialState: State = {
  isFetching: false,
  siteTags: null,
  error: null,
  selectedSiteTags: []
};

export function reducer(state: State = initialState, action: Actions | SelectTypeActions): State {
  switch (action.type) {
    case 'FETCH_SITE_TAGS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_SITE_TAGS_SUCCESS':
      return {
        isFetching: false,
        siteTags: action.payload.sort((a, b) => a.name.localeCompare(b.name)),
        error: null,
        selectedSiteTags: []
      };
    case 'FETCH_SITE_TAGS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'SELECTED_TAG':
      return {
        ...state,
        selectedSiteTags: state.selectedSiteTags.includes(action.payload)
          ? state.selectedSiteTags.filter(name => name !== action.payload)
          : [...state.selectedSiteTags, action.payload]
      };
    case 'CLEAR_TAG':
      return {
        ...state,
        selectedSiteTags: []
      };
    default:
      return state;
  }
}
