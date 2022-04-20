import { ExpirationUnits } from '@pec/aion-ui-core/interfaces/trainingRequirement';

const daysInWeek: number = 7;
const daysInYear: number = 365;
const monthsInYear: number = 12;
const daysInMonth: number = daysInYear / monthsInYear;
const defaultOutputValue: number = 0;
const millisecondsInDay: number = 1000 * 60 * 60 * 24;

export function getTrainingExpirationDuration(ms: number | string, unit: ExpirationUnits): number {
  const days: number = Number(ms) / millisecondsInDay;
  let output: number;

  switch (unit) {
    case ExpirationUnits.Days:
      output = days;
      break;
    case ExpirationUnits.Weeks:
      output = days / daysInWeek;
      break;
    case ExpirationUnits.Months:
      output = days / daysInMonth;
      break;
    case ExpirationUnits.Years:
      output = days / daysInYear;
      break;
    case ExpirationUnits.None:
    default:
      output = 0;
  }

  return Math.round(output);
}

export function getTrainingExpirationInMilliseconds(duration: number | string, unit: ExpirationUnits): number {
  const days: number = Number(duration) * millisecondsInDay;
  let output: number;

  switch (unit) {
    case ExpirationUnits.Days:
      output = days;
      break;
    case ExpirationUnits.Weeks:
      output = days * daysInWeek;
      break;
    case ExpirationUnits.Months:
      output = days * daysInMonth;
      break;
    case ExpirationUnits.Years:
      output = days * daysInYear;
      break;
    case ExpirationUnits.None:
    default:
      output = defaultOutputValue;
  }

  return Math.round(output);
}
