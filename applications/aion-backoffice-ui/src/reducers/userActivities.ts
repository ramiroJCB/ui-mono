import { Actions as FetchActions } from 'actions/fetchUserActivities';
import { Actions as UpdateActions } from 'actions/updateUserActivities';
import { AxiosError } from 'axios';
import { IUserActivity } from 'interfaces/userActivity';

export type State = {
  readonly isFetching: boolean;
  readonly userActivities: Partial<IUserActivity>[] | null;
  readonly error: AxiosError | Error | null;
};

type Actions = FetchActions | UpdateActions;

export const initialState: State = {
  isFetching: false,
  userActivities: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_USER_ACTIVITIES_REQUEST':
    case 'UPDATE_USER_ACTIVITIES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_USER_ACTIVITIES_SUCCESS':
    case 'UPDATE_USER_ACTIVITIES_SUCCESS':
      return {
        isFetching: false,
        userActivities: action.payload,
        error: null
      };
    case 'FETCH_USER_ACTIVITIES_FAILURE':
    case 'UPDATE_USER_ACTIVITIES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
