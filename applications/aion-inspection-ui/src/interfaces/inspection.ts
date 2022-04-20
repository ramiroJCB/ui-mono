import { Moment } from 'moment';

export interface IInspection {
  id: string;
  displayId: number;
  organizationId: string;
  organizationName: string;
  contractorId: string;
  contractorName: string;
  formId: string;
  formName: string;
  businessUnitId: string | null;
  businessUnitName: string | null;
  createdByUserId: string;
  createdByUserFirstName: string;
  createdByUserLastName: string;
  dateOfInspectionUtc: string;
  status: CurrentStatus;
  submittedDatetimeUtc: string | null;
  attachmentCount?: number;
}

export interface IInspectionForm {
  organizationId: string;
  contractorId: string;
  formId: string;
  businessUnitId: string | null;
  dateOfInspectionUtc: Moment;
}

export enum CurrentStatus {
  InProgress = 'InProgress',
  Submitted = 'Submitted'
}
