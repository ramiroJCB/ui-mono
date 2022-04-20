import { beforeGracePeriod, getDisplayName, getDueDate, getLocalizedPeriodStatus, getStatus } from './helpers';
import { contractorPeriods } from '../fixtures/contractorPeriods';
import { DisplayPeriodStatus } from './interfaces/contractorPeriod';
import '@pec/aion-ui-i18next';
import i18next from 'i18next';

const { Waiting, PastDue, Posted, LatePost } = DisplayPeriodStatus;
const t = i18next.t.bind(i18next);

describe('getDisplayName', () => {
  it('gets the display name depending on the period duration', () => {
    const periods = [contractorPeriods[6], contractorPeriods[0]];
    const results = ['July 2018', 'April 2019'];

    periods.forEach(({ startDate, duration }, i) => expect(getDisplayName(startDate, duration, t)).toBe(results[i]));
  });
});

describe('getLocalizedPeriodStatus', () => {
  it('returns the localized status', () => {
    expect(getLocalizedPeriodStatus(DisplayPeriodStatus.LatePost, t)).toEqual('Late Post');
    expect(getLocalizedPeriodStatus(DisplayPeriodStatus.PastDue, t)).toEqual('Past Due');
    expect(getLocalizedPeriodStatus(DisplayPeriodStatus.Posted, t)).toEqual('Posted');
    expect(getLocalizedPeriodStatus(DisplayPeriodStatus.Waiting, t)).toEqual('Waiting');
  });
});

describe('getStatus', () => {
  it('converts status payload to the correct status to display', () => {
    Date.now = jest.fn(() => 1554580169000);
    const results = [Waiting, PastDue, Waiting, LatePost, Posted, PastDue, PastDue];

    contractorPeriods.forEach(({ endDate, gracePeriodMillis, reportStatus, reportStatusUpdatedDateUtc }, i) =>
      expect(getStatus(endDate, gracePeriodMillis, reportStatus, reportStatusUpdatedDateUtc)).toBe(results[i])
    );
  });
});

describe('getDueDate', () => {
  it('gets the due date depending on the end date and grace period', () => {
    expect(getDueDate('2018-08-01T00:00:00', 8 * 24 * 60 * 60 * 1000).toJSON()).toBe('2018-08-08T23:59:59.999Z');
    expect(getDueDate('2018-12-01T00:00:00', 20 * 24 * 60 * 60 * 1000).toJSON()).toBe('2018-12-20T23:59:59.999Z');
  });
});

describe('beforeGracePeriod', () => {
  it('determines if the grace period has passed', () => {
    expect(beforeGracePeriod('2018-08-01T00:00:00', 8 * 24 * 60 * 60 * 1000)).toBe(false);
  });

  it('determines if the grace period is still in effect', () => {
    expect(beforeGracePeriod('2022-08-01T00:00:00', 8 * 24 * 60 * 60 * 1000)).toBe(true);
  });
});
