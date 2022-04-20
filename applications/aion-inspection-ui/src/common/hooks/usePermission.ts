import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { useParams } from 'react-router-dom';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { useTypedSelector } from 'app/reducer';

export function usePermission() {
  const { Manage } = ActivityAction;
  const { ContractorReviews } = ActivityResourceName;
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

  const hasContractorReviewsManagePermission =
    hasGlobalPermission(Manage, ContractorReviews) || hasOrganizationPermission(Manage, ContractorReviews);

  return { hasGlobalPermission, hasOrganizationPermission, hasContractorReviewsManagePermission };
}
