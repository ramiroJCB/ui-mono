import axios, { AxiosError } from 'axios';
import { IUserActivity } from 'interfaces/userActivity';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

export const fetchUserActivitiesRequest = () =>
  ({
    type: 'FETCH_USER_ACTIVITIES_REQUEST'
  } as const);

export const fetchUserActivitiesSuccess = (payload: IUserActivity[]) =>
  ({
    type: 'FETCH_USER_ACTIVITIES_SUCCESS',
    payload
  } as const);

export const fetchUserActivitiesFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_USER_ACTIVITIES_FAILURE',
    error
  } as const;
};

const shouldFetchUserActivities = (state: RootState) => !state.userActivities.isFetching;

export const fetchUserActivities = (
  userId: string,
  activityType: UserInfoActivitiesType,
  scopeId: string | undefined
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchUserActivitiesRequest());

    const response = await axios.get<IUserActivity[]>(`/api/v3/users/${userId}/activities`, {
      params: { activityType, scopeId }
    });

    dispatch(fetchUserActivitiesSuccess(response.data));
  } catch (error) {
    dispatch(fetchUserActivitiesFailure(error));
  }
};

export const fetchUserActivitiesIfNeeded = (
  userId: string,
  activityType: UserInfoActivitiesType,
  scopeId?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchUserActivities(getState())) {
    dispatch(fetchUserActivities(userId, activityType, scopeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchUserActivitiesRequest>
  | ReturnType<typeof fetchUserActivitiesSuccess>
  | ReturnType<typeof fetchUserActivitiesFailure>;
