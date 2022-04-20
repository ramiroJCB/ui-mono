import axios, { AxiosError } from 'axios';
import { fetchUserActivities } from 'actions/fetchUserActivities';
import { filterLegacyPermissionsNotOverriden } from 'helpers/userActivities';
import { IActivityResource } from 'interfaces/activityResource';
import { IUserActivity } from 'interfaces/userActivity';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

export const updateUserActivitiesRequest = () =>
  ({
    type: 'UPDATE_USER_ACTIVITIES_REQUEST'
  } as const);

export const updateUserActivitiesSuccess = (payload: Partial<IUserActivity>[]) =>
  ({
    type: 'UPDATE_USER_ACTIVITIES_SUCCESS',
    payload
  } as const);

export const updateUserActivitiesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_USER_ACTIVITIES_FAILURE',
    error
  } as const;
};

export const updateUserActivities = (
  userId: string,
  activityType: UserInfoActivitiesType,
  scopeId: string | undefined,
  userActivities: Partial<IUserActivity>[],
  activityResources: IActivityResource[]
): ThunkAction<Promise<Partial<IUserActivity>[]>, RootState, null, Actions> => dispatch => {
  // the api will 400 if we PUT a legacy permission which is also isOverride false
  const filteredActivities = filterLegacyPermissionsNotOverriden(userActivities, activityResources);

  return new Promise<Partial<IUserActivity>[]>(async (resolve, reject) => {
    try {
      dispatch(updateUserActivitiesRequest());

      await axios.put<IUserActivity[]>(`/api/v3/users/${userId}/activities`, filteredActivities, {
        params: { activityType, scopeId }
      });

      dispatch(updateUserActivitiesSuccess(userActivities));

      // This fetches user activities in case user unchecked 'override', and ensures default permissions are accurate in the UI.
      dispatch(fetchUserActivities(userId, activityType, scopeId));
      resolve(userActivities);
    } catch (error) {
      dispatch(updateUserActivitiesFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateUserActivitiesRequest>
  | ReturnType<typeof updateUserActivitiesSuccess>
  | ReturnType<typeof updateUserActivitiesFailure>;
