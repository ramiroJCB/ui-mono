import { CurrentStatus } from './inspection';

export interface IInspectionSection {
  contractorId: string;
  id: string;
  inspectionId: string;
  isDeleted: boolean;
  organizationId: string;
  sectionId: string;
  sectionName: string;
  sectionSortOrder: number;
  status: CurrentStatus;
}
