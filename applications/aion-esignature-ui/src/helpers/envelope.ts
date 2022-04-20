import { EnvelopeStatus } from '@pec/aion-ui-core/interfaces/envelope';
import { TFunction } from 'i18next';

export function localizeEnvelopeStatusDescription(status: EnvelopeStatus, t: TFunction) {
  const descriptions = {
    [EnvelopeStatus.Pending]: t('eSignature.components.pending', 'Pending'),
    [EnvelopeStatus.NotSigned]: t('eSignature.common.notSigned', 'Not Signed'),
    [EnvelopeStatus.AssigneeAssigned]: t('eSignature.components.assigneeAssigned', 'Assignee Assigned'),
    [EnvelopeStatus.OwnerAssigned]: t('eSignature.components.ownerAssigned', 'Owner Assigned'),
    [EnvelopeStatus.WaitingForOthers]: t('eSignature.common.waitingForOthers', 'Waiting For Others'),
    [EnvelopeStatus.Completed]: t('eSignature.common.completed', 'Completed')
  };

  return descriptions[status] ?? '';
}
