import { IVerification } from '../src/interfaces/verification';

const TEN_DAYS_FROM_NOW = Date.now() + 10 * 24 * 60 * 60 * 1000;

export const verifications: IVerification[] = [
  {
    legacyId: 1000,
    name: 'OSHA Verification',
    status: 'Compliant',
    isVerified: true,
    questionnaireSectionId: 4,
    expirationDate: '2017-02-10',
    expiringPeriodDays: 41
  },
  {
    legacyId: 1001,
    name: 'EMR Verification',
    status: 'In Progress',
    isVerified: null,
    questionnaireSectionId: 112,
    expirationDate: new Date(TEN_DAYS_FROM_NOW).toISOString().slice(0, 10),
    expiringPeriodDays: 30
  },
  {
    legacyId: 1002,
    name: 'OSHA Citation Verification',
    status: 'Non Compliant',
    isVerified: false,
    questionnaireSectionId: 130,
    expirationDate: null,
    expiringPeriodDays: 41
  }
];
