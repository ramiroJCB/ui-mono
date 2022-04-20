export interface IClientGracePeriod {
  id: string;
  effectiveGracePeriod: string | null;
  gracePeriodExpirationDateForClient: string | null;
  clientName: string;
}
