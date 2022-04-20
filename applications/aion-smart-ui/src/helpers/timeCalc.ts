import { intl } from '@pec/aion-ui-i18next';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

export const millisToHoursString = (millis: number) => (millis / HOUR).toFixed(1);

export const millisToHMString = (millis: number) => {
  const hours = Math.floor(millis / HOUR);
  const minutes = Math.floor((millis % HOUR) / MINUTE);
  return `${intl.formatNumber(hours, { style: 'unit', unit: 'hour' })} ${intl.formatNumber(minutes, {
    style: 'unit',
    unit: 'minute'
  })}`;
};
