import { IClientGracePeriod } from 'interfaces/clientGracePeriod';

type SortOrder = 'asc' | 'desc';

export const sortGracePeriodEffectiveDates = (
  clientGracePeriods: IClientGracePeriod[],
  sortOrder: SortOrder
): IClientGracePeriod[] =>
  clientGracePeriods.sort((a, b) => {
    const date1 = a.effectiveGracePeriod ? new Date(a.effectiveGracePeriod) : null;
    const date2 = b.effectiveGracePeriod ? new Date(b.effectiveGracePeriod) : null;
    return date1 && date2 ? ((sortOrder === 'asc' ? date1 > date2 : date1 < date2) ? 1 : -1) : 0;
  });
