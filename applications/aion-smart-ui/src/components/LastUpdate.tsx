import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeRelativeTime } from '@pec/aion-ui-i18next/helpers/localize';
import { formats } from '@pec/aion-ui-i18next/constants';

type Props = {
  status: string | null;
  lastUpdatedDate: string | null;
};

export const LastUpdate: React.FC<Props> = ({ status, lastUpdatedDate }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {status &&
        {
          CheckedIn: t('smart.lastUpdate.checkedIn', 'Checked in'),
          CheckedOut: t('smart.lastUpdate.checkedOut', 'Checked out'),
          Injured: t('smart.lastUpdate.reportedAsInjured', 'Reported as injured'),
          Rejected: t('smart.lastUpdate.rejected', 'Rejected')
        }[status]}{' '}
      {lastUpdatedDate && (
        <Tooltip placement="right" title={localizeDate(lastUpdatedDate, t, formats.dateFull)}>
          <span>{localizeRelativeTime(lastUpdatedDate, t)}</span>
        </Tooltip>
      )}
    </React.Fragment>
  );
};
