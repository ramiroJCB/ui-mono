export interface IVerification {
  legacyId: number;
  name: string;
  status: string;
  isVerified: boolean | null;
  questionnaireSectionId: number;
  expirationDate: string | null;
  expiringPeriodDays: number;
}
