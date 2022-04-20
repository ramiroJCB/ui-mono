import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';

const { Accepted, AcceptedNotApplicable, SubmittedComplete, SubmittedNotApplicable } = SafetyProgramRequirementStatus;

export const requirementIsSubmitted = (status: SafetyProgramRequirementStatus) => {
  switch (status) {
    case Accepted:
    case AcceptedNotApplicable:
    case SubmittedComplete:
    case SubmittedNotApplicable:
      return true;
    default:
      return false;
  }
};
