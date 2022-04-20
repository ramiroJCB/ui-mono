import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { useParams } from 'react-router-dom';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { useTypedSelector } from 'combineReducers';

export function usePermission() {
  const { Audit, Write, Manage } = ActivityAction;
  const { TaskGroups } = ActivityResourceName;
  const { userInfo } = useTypedSelector(state => state.userInfo);
  const { organizationId } = useParams<{ organizationId: string }>();

  const hasGlobalPermission = (action: ActivityAction, resourceName: ActivityResourceName) =>
    hasPermission(userInfo, action, resourceName);

  const hasOrganizationPermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    return organizationId
      ? hasPermission(userInfo, action, resourceName, [
          {
            type: UserInfoActivitiesType.Organization,
            id: organizationId
          }
        ])
      : false;
  };

  const hasTaskGroupsWritePermission =
    hasGlobalPermission(Write, TaskGroups) || hasOrganizationPermission(Write, TaskGroups);

  const hasTaskGroupsManagePermission =
    hasGlobalPermission(Manage, TaskGroups) || hasOrganizationPermission(Manage, TaskGroups);

  const hasTaskGroupsAuditPermission =
    hasGlobalPermission(Audit, TaskGroups) || hasOrganizationPermission(Audit, TaskGroups);

  return {
    hasGlobalPermission,
    hasOrganizationPermission,
    hasTaskGroupsWritePermission,
    hasTaskGroupsManagePermission,
    hasTaskGroupsAuditPermission
  };
}
