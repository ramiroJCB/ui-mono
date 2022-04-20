import { IClientPeriod } from './clientPeriod';

// https://pecteam.atlassian.net/browse/SMAR-138

export interface IContractorPeriod extends IClientPeriod {
  periodId: string;
  reportStatus: PeriodStatus;
  reportStatusUpdatedDateUtc: string | null;
  contractorId: string;
  contractorName: string;

  // TODO: Require this after the API is released
  isEditedAfterDeadline?: boolean;
}

export enum PeriodStatus {
  Submitted = 'Submitted',
  Saved = 'Saved',
  NotSaved = 'NotSaved'
}

export enum DisplayPeriodStatus {
  Waiting = 'Waiting',
  PastDue = 'Past Due',
  Posted = 'Posted',
  LatePost = 'Late Post'
}
