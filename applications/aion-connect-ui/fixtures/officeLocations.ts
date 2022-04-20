import { IOfficeLocation, OfficeLocationType } from '../src/interfaces/officeLocation';

export const officeLocations: IOfficeLocation[] = [
  {
    id: 'cd3d90ba-dbc7-4670-aaa0-215bb8a20d62',
    organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
    type: OfficeLocationType.Primary,
    name: 'Main Office',
    streetAddress: '123 Industrial Dr',
    city: 'Mandeville',
    state: 'LA',
    postalCode: '70470',
    isDeleted: false
  },
  {
    id: 'dc910b77-666c-4db0-8a7e-e0c9fbb438cf',
    organizationId: 'f4ee1c7c-d78a-4e7f-a42a-fc8a4d08341f',
    type: OfficeLocationType.AdditionalOffice,
    name: 'Secondary Office',
    streetAddress: '456 Industrial Dr',
    city: 'Mandeville',
    state: 'LA',
    postalCode: '70470',
    isDeleted: false
  }
];
