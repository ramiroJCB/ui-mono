import { IInsurance } from '../src/interfaces/insurance';

const TEN_DAYS_FROM_NOW = Date.now() + 10 * 24 * 60 * 60 * 1000;

export const insurances: IInsurance[] = [
  {
    organizationName: 'Parsley Energy',
    questionSectionId: 29,
    earliestPolicyExpirationDate: '2017-01-01T00:00:00'
  },
  {
    organizationName: 'Sage Energy',
    questionSectionId: 30,
    earliestPolicyExpirationDate: new Date(TEN_DAYS_FROM_NOW).toISOString()
  },
  {
    organizationName: 'Rosemary Energy',
    questionSectionId: 31,
    earliestPolicyExpirationDate: '2050-01-01T00:00:00'
  },
  {
    organizationName: 'Thyme Energy',
    questionSectionId: 32,
    earliestPolicyExpirationDate: '2050-01-01T00:00:00'
  }
];
