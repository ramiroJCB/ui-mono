import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { useParams } from 'react-router-dom';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { useTypedSelector } from 'app/reducer';

export function usePermission() {
  const { Read, Write } = ActivityAction;
  const { Forms } = ActivityResourceName;
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

  const hasFormsReadPermission = hasGlobalPermission(Read, Forms) || hasOrganizationPermission(Read, Forms);
  const hasFormsWritePermission = hasGlobalPermission(Write, Forms) || hasOrganizationPermission(Write, Forms);

  return { hasGlobalPermission, hasOrganizationPermission, hasFormsReadPermission, hasFormsWritePermission };
}
