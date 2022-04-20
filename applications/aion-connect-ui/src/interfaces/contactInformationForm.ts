import { ContactType } from './contactInformation';

export interface IContactInformationForm {
  type: ContactType;
  phoneNumber: string | null;
  websiteUrl: string | null;
  emailAddress: string | null;
}
