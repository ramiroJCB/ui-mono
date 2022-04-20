import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { useParams } from 'react-router-dom';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { useTypedSelector } from 'combineReducers';

export function usePermission() {
  const { Audit, Write, Manage } = ActivityAction;
  const { SafetyProgramRequirementClients } = ActivityResourceName;
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

  const hasSafetyProgramRequirementClientsWritePermission =
    hasGlobalPermission(Write, SafetyProgramRequirementClients) ||
    hasOrganizationPermission(Write, SafetyProgramRequirementClients);

  const hasSafetyProgramRequirementClientsManagePermission =
    hasGlobalPermission(Manage, SafetyProgramRequirementClients) ||
    hasOrganizationPermission(Manage, SafetyProgramRequirementClients);

  const hasSafetyProgramRequirementClientsAuditPermission =
    hasGlobalPermission(Audit, SafetyProgramRequirementClients) ||
    hasOrganizationPermission(Audit, SafetyProgramRequirementClients);

  const disabled =
    !hasSafetyProgramRequirementClientsWritePermission &&
    !hasSafetyProgramRequirementClientsManagePermission &&
    !hasSafetyProgramRequirementClientsAuditPermission;

  return {
    hasGlobalPermission,
    hasOrganizationPermission,
    hasSafetyProgramRequirementClientsWritePermission,
    hasSafetyProgramRequirementClientsManagePermission,
    hasSafetyProgramRequirementClientsAuditPermission,
    disabled
  };
}
