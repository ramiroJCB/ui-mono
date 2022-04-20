import { EnvelopeStatus, EnvelopeStatusDescription } from '@pec/aion-ui-core/interfaces/envelope';

const { AssigneeAssigned, Completed, NotSigned, OwnerAssigned, Pending, WaitingForOthers } = EnvelopeStatus;

export const getImpliedEnvelopeStatus = (
  isOwner: boolean,
  status: EnvelopeStatus,
  returnDesciption: boolean = false
) => {
  return isOwner ? getOwnerStatus(status, returnDesciption) : getAssigneeStatus(status, returnDesciption);
};

const getAssigneeStatus = (status: EnvelopeStatus, returnDescription: boolean) => {
  switch (status) {
    case AssigneeAssigned:
    case Pending:
      return returnDescription ? EnvelopeStatusDescription.get(NotSigned) : NotSigned;
    case OwnerAssigned:
      return returnDescription ? EnvelopeStatusDescription.get(WaitingForOthers) : WaitingForOthers;
    case Completed:
      return returnDescription ? EnvelopeStatusDescription.get(Completed) : Completed;
    default:
      return 'Unknown';
  }
};

const getOwnerStatus = (status: EnvelopeStatus, returnDescription: boolean) => {
  switch (status) {
    case AssigneeAssigned:
    case Pending:
      return returnDescription ? EnvelopeStatusDescription.get(WaitingForOthers) : WaitingForOthers;
    case OwnerAssigned:
      return returnDescription ? EnvelopeStatusDescription.get(NotSigned) : NotSigned;
    case Completed:
      return returnDescription ? EnvelopeStatusDescription.get(Completed) : Completed;
    default:
      return 'Unknown';
  }
};
