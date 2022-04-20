import { TFunction } from 'i18next';

export const operationConfirmation = (action: string, status: string, t: TFunction) => {
  const options = {
    pending: {
      Associate: t(
        'oshaViolations.confirmationOps.movingViolationToAssociated',
        'Moving a Violation to Associated status will add it to this contractor’s violation total.'
      ),
      Unassociate: t(
        'oshaViolations.confirmationOps.movingViolationToUnassociatedNot',
        'Moving a Violation to Unassociated status will not affect this contractor’s violation total.'
      )
    },
    unassociated: {
      Associate: t(
        'oshaViolations.confirmationOps.movingViolationToAssociated',
        'Moving a Violation to Associated status will add it to this contractor’s violation total.'
      ),
      'Move To Pending': t(
        'oshaViolations.confirmationOps.movingViolationToPendingNot',
        'Moving a Violation to Pending status will not affect this contractor’s violation total.'
      )
    },
    associated: {
      'Move To Pending': t(
        'oshaViolations.confirmationOps.movingViolationToPending',
        'Moving a Violation to Pending status will remove it from this contractor’s violation total.'
      ),
      Unassociate: t(
        'oshaViolations.confirmationOps.movingViolationToUnassociated',
        'Moving a Violation to Unassociated status will remove it from this contractor’s violation total.'
      )
    },
    other: {
      'Move To Pending': t(
        'oshaViolations.confirmationOps.movingViolationToPendingNot',
        'Moving a Violation to Pending status will not affect this contractor’s violation total.'
      ),
      Associate: t(
        'oshaViolations.confirmationOps.movingViolationToAssociated',
        'Moving a Violation to Associated status will add it to this contractor’s violation total.'
      )
    }
  };
  return options[status][action];
};
