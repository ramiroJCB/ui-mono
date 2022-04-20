import { TFunction } from 'i18next';

export const getActionLabel = (action: string, t: TFunction): string => {
  switch (action) {
    case 'Associated':
      return t('oshaViolations.manualOps.associated', 'Associated');
    case 'Pending':
      return t('oshaViolations.manualOps.pending', 'Pending');
    case 'Unassociated':
    default:
      return t('oshaViolations.manualOps.unassociated', 'Unassociated');
  }
};
