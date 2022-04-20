export interface IContactInformation {
  id: string;
  organizationId: string;
  type: ContactType;
  phoneNumber: string | null;
  emailAddress: string | null;
  websiteUrl: string | null;
  isDeleted: boolean;
}

export enum ContactType {
  Primary = 'Primary'
}
