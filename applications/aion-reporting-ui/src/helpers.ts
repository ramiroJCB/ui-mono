import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ScheduleIcon from '@material-ui/icons/Schedule';
import UpdateIcon from '@material-ui/icons/Update';
import { DisplayPeriodStatus, PeriodStatus } from 'interfaces/contractorPeriod';
import { PeriodDuration } from 'interfaces/clientPeriod';
import { ReportType } from 'features/redirect/enums/reportType';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import { dateStyles, formats } from '@pec/aion-ui-i18next/constants';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const { Saved, Submitted } = PeriodStatus;
const { Waiting, PastDue, Posted, LatePost } = DisplayPeriodStatus;
const { Monthly } = PeriodDuration;

export const getDisplayName = (startDate: string, duration: PeriodDuration, t: TFunction): string => {
  if (duration === Monthly) {
    return localizeDate(
      {
        value: startDate,
        config: {
          month: dateStyles.month.long,
          year: dateStyles.year.numeric
        }
      },
      t,
      formats.dateCustom
    );
  }

  return t('reporting.components.notImplementedYet', 'Not implemented yet');
};

export const getReportTypes = () =>
  Object.keys(ReportType)
    .map(key => ReportType[key])
    .join('|');

export const getDueDate = (endDate: string, gracePeriodMillis: number) => {
  const date = new Date(endDate).setMilliseconds(gracePeriodMillis - 1);

  return new Date(date);
};

export const beforeGracePeriod = (endDate: string, gracePeriodMillis: number) => {
  const dueDate = getDueDate(endDate, gracePeriodMillis);

  return Date.now() < dueDate.getTime();
};

export const getLocalizedPeriodStatus = (status: DisplayPeriodStatus, t: TFunction): string => {
  const statuses = {
    [LatePost]: t('reporting.periodStatuses.latePost', 'Late Post'),
    [PastDue]: t('reporting.periodStatuses.pastDue', 'Past Due'),
    [Posted]: t('reporting.periodStatuses.posted', 'Posted'),
    [Waiting]: t('reporting.periodStatuses.waiting', 'Waiting')
  };

  return statuses[status] ?? '';
};

export const getStatus = (
  endDate: string,
  gracePeriodMillis: number,
  metricStatus: PeriodStatus,
  metricStatusUpdatedDateUtc: string | null
): DisplayPeriodStatus => {
  const dueDate = getDueDate(endDate, gracePeriodMillis).getTime();
  const beforeDeadline = metricStatusUpdatedDateUtc
    ? new Date(metricStatusUpdatedDateUtc).getTime() < dueDate
    : Date.now() < dueDate;

  if (metricStatus === Saved) {
    return beforeDeadline ? Waiting : PastDue;
  }

  if (metricStatus === Submitted) {
    return beforeDeadline ? Posted : LatePost;
  }

  return beforeDeadline ? Waiting : PastDue;
};

export const getStatusColor = (theme: Theme, status: DisplayPeriodStatus): string =>
  ({
    [PastDue]: theme.palette.error.main,
    [Posted]: theme.palette.secondary.main,
    [LatePost]: theme.palette.error.light
  }[status] || theme.palette.primary.main);

export const getStatusIcon = (status: DisplayPeriodStatus): React.ComponentType<SvgIconProps> =>
  ({
    [Waiting]: ScheduleIcon,
    [PastDue]: HighlightOffIcon,
    [Posted]: CheckCircleIcon,
    [LatePost]: UpdateIcon
  }[status] || ScheduleIcon);
