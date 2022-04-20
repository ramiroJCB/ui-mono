export interface IOfficeLocation {
  id: string;
  organizationId: string;
  type: OfficeLocationType;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  isDeleted: boolean;
}

export enum OfficeLocationType {
  Primary = 'Primary',
  AdditionalOffice = 'AdditionalOffice'
}
