import { Actions } from 'actions/activityResources';
import { AxiosError } from 'axios';
import { IActivityResource } from 'interfaces/activityResource';

export type State = {
  readonly isFetching: boolean;
  readonly activityResources: IActivityResource[] | null;
  readonly error: AxiosError | Error | null;
};

const initialState: State = {
  isFetching: false,
  activityResources: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ACTIVITY_RESOURCES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ACTIVITY_RESOURCES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        activityResources: action.payload
          .sort((a, b) => a.name.localeCompare(b.name))
          .sort((a, b) => (a.isLegacyResource === b.isLegacyResource ? 0 : !a.isLegacyResource ? -1 : 1)),
        error: null
      };
    case 'FETCH_ACTIVITY_RESOURCES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
