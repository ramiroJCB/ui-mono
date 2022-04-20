export const gracePeriodExpired = (expirationDate?: string | null) =>
  expirationDate ? new Date() > new Date(expirationDate) : false;
