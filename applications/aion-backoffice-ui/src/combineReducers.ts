import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { FormStateMap, reducer as formReducer } from 'redux-form';
import { reducer as activityResources, State as ActivityResourcesState } from './reducers/activityResources';
import { reducer as organizations, State as OrganizationsState } from './reducers/organizations';
import { reducer as organizationsForUser, State as OrganizationsForUserState } from './reducers/organizationsForUser';
import { reducer as user, State as UserState } from './reducers/user';
import { reducer as userActivities, State as UserActivitiesState } from './reducers/userActivities';
import { reducer as users, State as UsersState } from './reducers/users';
import { reducer as organizationFeatures, State as OrganizationFeatures } from './reducers/organizationFeatures';
import { RootActions } from './combineActions';

type BackOfficeRootState = {
  form: FormStateMap;
  activityResources: ActivityResourcesState;
  organizations: OrganizationsState;
  organizationsForUser: OrganizationsForUserState;
  user: UserState;
  userActivities: UserActivitiesState;
  users: UsersState;
  organizationFeatures: OrganizationFeatures;
};

export type RootState = CommonRootState & BackOfficeRootState;

export default combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  form: formReducer,
  activityResources,
  organizations,
  organizationsForUser,
  organizationFeatures,
  user,
  userActivities,
  users
});
