import { DisplayPeriodStatus, PeriodStatus } from './contractorPeriod';
import { IContractor } from './contractor';

export interface IMetricContractor extends IContractor {
  metricStatus: PeriodStatus;
  metricStatusUpdatedDateUtc: string | null;
  metricValuesTotal: number;
  displayMetricStatus?: DisplayPeriodStatus;

  // TODO: Require this after the API is released
  isEditedAfterDeadline?: boolean;
}
