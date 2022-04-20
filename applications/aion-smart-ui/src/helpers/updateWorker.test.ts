import { getWorkersOffsetWhenLivesOnSiteChanges, getWorkersOffsetWhenStatusChanges } from './updateWorker';
import { WorkerStatus } from '../interfaces/worker';

const { CheckedIn, CheckedOut, Injured, Rejected } = WorkerStatus;

describe('getWorkersOffsetWhenStatusChanges', () => {
  it('returns 1 if status becomes checked in and worker lives off site', () => {
    expect(getWorkersOffsetWhenStatusChanges(false, CheckedIn)).toBe(1);
  });

  it('returns -1 if status becomes checked out or injured and worker lives off site', () => {
    expect(getWorkersOffsetWhenStatusChanges(false, Injured)).toBe(-1);
  });

  it('ignores status change if lives on site is true', () => {
    expect(getWorkersOffsetWhenStatusChanges(true, Rejected)).toBe(0);
  });
});

describe('getWorkersOffsetWhenLivesOnSiteChanges', () => {
  it('returns 1 when lives on site is set to true and status does not equal checked in', () => {
    expect(getWorkersOffsetWhenLivesOnSiteChanges(true, CheckedOut)).toBe(1);
  });

  it('returns -1 if lives on site is set to false and status does not equal checked in', () => {
    expect(getWorkersOffsetWhenLivesOnSiteChanges(false, Injured)).toBe(-1);
  });

  it('ignores toggling lives on site if status equals checked in', () => {
    expect(getWorkersOffsetWhenLivesOnSiteChanges(true, CheckedIn)).toBe(0);
  });
});
