import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';

export interface IContractorWorkGroupJobType {
  id: string;
  workGroupJobTypeId: string;
  organizationId: string;
  workGroupId: string;
  jobTypeId: string;
  jobTypeName: string;
  jobTypeDescription: string;
  contractorId: string;
  contractorOrganizationId: string;
  contractorName: string;
  isDeleted: boolean;
  compliantEmployeesCount: number;
  totalEmployeesCount: number;
  compliantEmployeesPercentage: number;
  employeeCountUpdatedDateUtc: string;
  jobType: IJobType;
}
