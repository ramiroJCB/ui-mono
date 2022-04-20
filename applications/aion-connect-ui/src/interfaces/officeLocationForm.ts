import { OfficeLocationType } from './officeLocation';

export interface IOfficeLocationForm {
  type: OfficeLocationType;
  name: string;
  streetAddress: string;
  city: string;
  state?: { value: string; label: string };
  postalCode: string;
}

export interface IEditOfficeLocationForm extends IOfficeLocationForm {
  id: string;
  isDeleted: boolean;
}
