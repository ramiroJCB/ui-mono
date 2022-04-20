import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { DeepReadonly } from 'ts-essentials';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { IComment } from 'interfaces/comment';
import { IUserInfo } from '@pec/aion-ui-core/interfaces/userInfo';
import { requirementIsSubmitted } from './requirementIsSubmitted';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';

const { Manage } = ActivityAction;
const { SafetyProgramEvaluations, SafetyPrograms } = ActivityResourceName;

export const canChangeIsRead = (userInfo: DeepReadonly<IUserInfo>, isEvaluatorComment: boolean) =>
  hasPermission(userInfo, Manage, SafetyProgramEvaluations) ? !isEvaluatorComment : isEvaluatorComment;

export const canDeleteComment = (
  userInfo: DeepReadonly<IUserInfo>,
  status: SafetyProgramRequirementStatus,
  comment: IComment
) =>
  hasPermission(userInfo, Manage, SafetyPrograms)
    ? !requirementIsSubmitted(status) || comment.isEvaluatorComment
    : hasPermission(userInfo, Manage, SafetyProgramEvaluations)
    ? status !== (SafetyProgramRequirementStatus.Rejected || SafetyProgramRequirementStatus.RejectedNotApplicable) &&
      userInfo.userName === comment.createdBy
    : !requirementIsSubmitted(status) && userInfo.userName === comment.createdBy;
