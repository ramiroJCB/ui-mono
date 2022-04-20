import { CurrentStatus, IInspection } from '../src/interfaces/inspection';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const filler = {
  organizationId: organizations[3].id,
  organizationName: organizations[3].name,
  formId: 'ffbeb629-1d2d-4568-8a6c-28571e42e9b1',
  createdByUserId: '7ecbf717-39ac-4309-bed2-7089840fb6ed',
  createdByUserFirstName: 'James',
  createdByUserLastName: 'Test',
  submittedDatetimeUtc: '2020-07-14T13:30:00Z'
};

const { InProgress, Submitted } = CurrentStatus;

export const inspections: IInspection[] = [
  {
    ...filler,
    formName: 'SoCal Gas - Form 2849',
    contractorId: organizations[2].id,
    contractorName: organizations[2].name,
    id: '783059c0-2b0e-4a8b-aff0-be8b7ee6a9c7',
    displayId: 8885919,
    businessUnitId: 'c587d96f-c102-4d59-a63f-154ffa14186d',
    businessUnitName: 'Distribution',
    status: InProgress,
    dateOfInspectionUtc: '2020-07-15T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 2849',
    contractorId: organizations[2].id,
    contractorName: organizations[2].name,
    id: 'ea04a675-400d-4622-a7e4-bbe62784559d',
    displayId: 8885920,
    businessUnitId: null,
    businessUnitName: null,
    status: Submitted,
    attachmentCount: 1,
    dateOfInspectionUtc: '2020-07-10T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 2849',
    contractorId: organizations[2].id,
    contractorName: organizations[2].name,
    id: '5a6d07f1-433f-4e62-8561-3a011c99ec83',
    displayId: 8885921,
    businessUnitId: '42f78df9-e5e6-4657-9097-52d483f4fdfb',
    businessUnitName: 'Waste Water',
    status: InProgress,
    attachmentCount: 2,
    dateOfInspectionUtc: '2020-07-11T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 2849',
    contractorId: organizations[2].id,
    contractorName: organizations[2].name,
    id: 'b5d08cd9-b864-4637-8d55-3d26b0d74591',
    displayId: 8885922,
    businessUnitId: '98e40df5-4528-4753-9524-7749d1288938',
    businessUnitName: 'Fracking',
    status: Submitted,
    attachmentCount: 3,
    dateOfInspectionUtc: '2020-07-12T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 2849',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'bbb08ccc-b864-4637-8d55-3d26b0d74591',
    displayId: 8885923,
    businessUnitId: 'eee40df5-4528-4753-9524-7749d1288938',
    businessUnitName: 'Well Renovation',
    status: Submitted,
    attachmentCount: 4,
    dateOfInspectionUtc: '2020-07-19T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d74591',
    displayId: 8885924,
    businessUnitId: null,
    businessUnitName: null,
    status: Submitted,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d56789',
    displayId: 8885925,
    businessUnitId: 'eee40df5-4528-4753-9524-7749d128333',
    businessUnitName: 'Hydro Awareness',
    status: Submitted,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d00000',
    displayId: 8885925,
    businessUnitId: 'eee40df5-4528-4753-9524-7749d124444',
    businessUnitName: 'Waste Removal',
    status: Submitted,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d11111',
    displayId: 8885927,
    businessUnitId: null,
    businessUnitName: null,
    status: InProgress,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-24T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d74591',
    displayId: 8885391,
    businessUnitId: null,
    businessUnitName: null,
    status: Submitted,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d56789',
    displayId: 8885392,
    businessUnitId: 'eee40df5-4528-4753-9524-7749d128333',
    businessUnitName: 'Hydro Awareness',
    status: Submitted,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d00000',
    displayId: 8885393,
    businessUnitId: 'eee40df5-4528-4753-9524-7749d124444',
    businessUnitName: 'Waste Removal',
    status: Submitted,
    dateOfInspectionUtc: '2020-07-20T13:30:00Z'
  },
  {
    ...filler,
    formName: 'SoCal Gas - Form 6350',
    contractorId: organizations[0].id,
    contractorName: organizations[0].name,
    id: 'ddd08hhh-b864-4637-8d55-3d26b0d11111',
    displayId: 8885394,
    businessUnitId: null,
    businessUnitName: null,
    status: InProgress,
    attachmentCount: 6,
    dateOfInspectionUtc: '2020-07-24T13:30:00Z'
  }
];
