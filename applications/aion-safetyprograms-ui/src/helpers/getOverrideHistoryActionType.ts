import { OverrideActionType } from 'interfaces/overrideHistory';
import { TFunction } from 'i18next';

export const getOverrideHistoryActionType = (actionType: OverrideActionType | null, t: TFunction): string => {
  switch (actionType) {
    case OverrideActionType.Approved:
      return t('safetyPrograms.overrideHistory.approved', 'Approved');
    case OverrideActionType.Cancelled:
      return t('safetyPrograms.overrideHistory.cancelled', 'Cancelled');
    case OverrideActionType.Denied:
      return t('safetyPrograms.overrideHistory.denied', 'Denied');
    case OverrideActionType.Granted:
      return t('safetyPrograms.overrideHistory.granted', 'Granted');
    case OverrideActionType.Requested:
      return t('safetyPrograms.overrideHistory.requested', 'Requested');
    case OverrideActionType.Removed:
      return t('safetyPrograms.overrideHistory.removed', 'Removed');
    case OverrideActionType.CommentChange:
      return t('safetyPrograms.overrideHistory.commentChange', 'Comment Change');
    default:
      return '';
  }
};
