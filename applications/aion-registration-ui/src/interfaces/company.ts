import { ICompanyForm } from './companyForm';

export interface ICompany extends ICompanyForm {
  readonly id: string;
  readonly logoUrl: string;
  readonly description: string;
  readonly subscriptionExpirationDate: string;
  readonly verticalId: string;
  readonly primaryAddress: string;
  readonly secondaryAddress: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly phoneNumberExtension: string;
  readonly emailAddress: string;
  readonly features: string[];
}
