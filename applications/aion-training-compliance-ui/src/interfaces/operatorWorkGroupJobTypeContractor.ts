import { IContractor } from './contractor';

export interface IOperatorWorkGroupJobTypeContractor {
  id: string;
  workGroupJobTypeId: string;
  organizationId: string;
  workGroupId: string;
  jobTypeId: string;
  contractorId: string;
  contractorOrganizationId: string;
  contractorName: string;
  isDeleted: boolean;
  compliantEmployeesCount: number;
  totalEmployeesCount: number;
  compliantEmployeesPercentage: number;
  employeeCountUpdatedDateUtc: string;
  contractor?: IContractor;
}
