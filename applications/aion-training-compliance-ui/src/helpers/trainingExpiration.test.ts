import { getTrainingExpirationDuration, getTrainingExpirationInMilliseconds } from './trainingExpiration';
import { ExpirationUnits } from '@pec/aion-ui-core/interfaces/trainingRequirement';

const days = 15;
const millisecondsInDays = 1296000000;
const millisecondsInMonths = 7884000000;
const millisecondsInWeeks = 2419200000;
const millisecondsInYears = 63072000000;
const months = 3;
const weeks = 4;
const years = 2;
const zero = 0;

describe('getTrainingExpirationDuration', () => {
  it('correctly formats the training expiration in years', () => {
    expect(getTrainingExpirationDuration(millisecondsInYears, ExpirationUnits.Years)).toBe(years);
  });
  it('correctly formats the training expiration in months', () => {
    expect(getTrainingExpirationDuration(millisecondsInMonths, ExpirationUnits.Months)).toBe(months);
  });
  it('correctly formats the training expiration in weeks', () => {
    expect(getTrainingExpirationDuration(millisecondsInWeeks, ExpirationUnits.Weeks)).toBe(weeks);
  });
  it('correctly formats the training expiration in days', () => {
    expect(getTrainingExpirationDuration(millisecondsInDays, ExpirationUnits.Days)).toBe(days);
  });
  it('returns 0 when the expiration unit equals none', () => {
    expect(getTrainingExpirationDuration(millisecondsInDays, ExpirationUnits.None)).toBe(zero);
  });
});

describe('getTrainingExpirationInMilliseconds', () => {
  it('correctly formats the training expiration in years', () => {
    expect(getTrainingExpirationInMilliseconds(years, ExpirationUnits.Years)).toBe(millisecondsInYears);
  });
  it('correctly formats the training expiration in months', () => {
    expect(getTrainingExpirationInMilliseconds(months, ExpirationUnits.Months)).toBe(millisecondsInMonths);
  });
  it('correctly formats the training expiration in weeks', () => {
    expect(getTrainingExpirationInMilliseconds(weeks, ExpirationUnits.Weeks)).toBe(millisecondsInWeeks);
  });
  it('correctly formats the training expiration in days', () => {
    expect(getTrainingExpirationInMilliseconds(days, ExpirationUnits.Days)).toBe(millisecondsInDays);
  });
  it('returns 0 when the expiration unit equals none', () => {
    expect(getTrainingExpirationInMilliseconds(days, ExpirationUnits.None)).toBe(zero);
  });
});
