import { WorkerStatus } from 'interfaces/worker';

export const getWorkersOffsetWhenStatusChanges = (livesOnSite: boolean, status: WorkerStatus) => {
  return !livesOnSite && status === WorkerStatus.CheckedIn
    ? 1
    : !livesOnSite && [WorkerStatus.CheckedOut, WorkerStatus.Injured].includes(status)
    ? -1
    : 0;
};

export const getWorkersOffsetWhenLivesOnSiteChanges = (livesOnSite: boolean, status: WorkerStatus | null) => {
  return livesOnSite && status !== WorkerStatus.CheckedIn
    ? 1
    : !livesOnSite && status !== WorkerStatus.CheckedIn
    ? -1
    : 0;
};
