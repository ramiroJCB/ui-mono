import { IContactInformation, ContactType } from '../src/interfaces/contactInformation';

const { Primary } = ContactType;

export const contactInformation: IContactInformation = {
  id: 'ee58512a-cd25-4c8e-9afd-179940470205',
  organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
  type: Primary,
  phoneNumber: '2223334444',
  emailAddress: 'thesatch@hotmail.com',
  websiteUrl: 'https://www.website.com',
  isDeleted: false
};
