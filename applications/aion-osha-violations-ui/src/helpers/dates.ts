import { TFunction } from 'i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

export const localizeUTCDate = (runDateTimeUtc: string, t: TFunction): string => {
  const date = new Date(runDateTimeUtc);
  const dateUTC = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  );

  return localizeDate(dateUTC, t);
};
