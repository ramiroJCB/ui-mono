import { ClientOverrideStatus } from 'interfaces/requirementOverride';
import { TFunction } from 'i18next';

export const getClientOverrideStatusDisplayValue = (status: ClientOverrideStatus | null, t: TFunction) => {
  switch (status) {
    case ClientOverrideStatus.Approved:
      return t('safetyPrograms.clientOverrideStatuses.approvedStatus', 'Exception Request Approved');
    case ClientOverrideStatus.Granted:
      return t('safetyPrograms.clientOverrideStatuses.grantedStatus', 'Exception Granted');
    case ClientOverrideStatus.Denied:
      return t('safetyPrograms.clientOverrideStatuses.deniedStatus', 'Exception Request Denied');
    case ClientOverrideStatus.Removed:
      return t('safetyPrograms.clientOverrideStatuses.removedStatus', 'Exception Removed');
    case ClientOverrideStatus.Requested:
      return t('safetyPrograms.clientOverrideStatuses.requestedStatus', 'Exception Requested');
    case ClientOverrideStatus.None:
    case null:
      return t('safetyPrograms.clientOverrideStatuses.noneStatus', 'No Exception In Place');
  }
};

export const getClientOverrideStatusGridDisplayValue = (status: ClientOverrideStatus | null, t: TFunction) => {
  switch (status) {
    case ClientOverrideStatus.Approved:
      return t('safetyPrograms.clientOverrideStatuses.approvedStatusGrid', 'Request Approved');
    case ClientOverrideStatus.Granted:
      return t('safetyPrograms.clientOverrideStatuses.grantedStatusGrid', 'Granted');
    case ClientOverrideStatus.Denied:
      return t('safetyPrograms.clientOverrideStatuses.deniedStatusGrid', 'Request Denied');
    case ClientOverrideStatus.Removed:
      return t('safetyPrograms.clientOverrideStatuses.removedStatusGrid', 'Removed');
    case ClientOverrideStatus.Requested:
      return t('safetyPrograms.clientOverrideStatuses.requestedStatusGrid', 'Requested');
    case ClientOverrideStatus.None:
    case null:
      return '';
  }
};
