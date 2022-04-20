export interface IClientPeriod {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  duration: PeriodDuration;
  gracePeriodMillis: number;
}

export enum PeriodDuration {
  Monthly = 'Monthly'
}
