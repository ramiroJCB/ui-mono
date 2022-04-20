import { Actions as ActivityResourcesActions } from './actions/activityResources';
import { Actions as FetchUserActivitiesActions } from './actions/fetchUserActivities';
import { Actions as OrganizationFeaturesActions } from './actions/organizationFeatures';
import { Actions as AddGlobalOrganizationFeatureActions } from './actions/addGlobalOrganizationFeature';
import { Actions as DeleteGlobalOrganizationFeatureActions } from './actions/deleteGlobalOrganizationFeature';
import { Actions as OrganizationsActions } from './actions/organizations';
import { Actions as OrganizationsForUserActions } from './actions/organizationsForUser';
import { Actions as UpdateUserActivitiesActions } from './actions/updateUserActivities';
import { Actions as UserActions } from './actions/user';
import { Actions as UsersActions } from './actions/users';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | CommonRootActions
  | AddGlobalOrganizationFeatureActions
  | ActivityResourcesActions
  | DeleteGlobalOrganizationFeatureActions
  | FetchUserActivitiesActions
  | OrganizationFeaturesActions
  | OrganizationsActions
  | OrganizationsForUserActions
  | UpdateUserActivitiesActions
  | UserActions
  | UsersActions;
