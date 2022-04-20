import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';

export interface IWorkGroupContractor {
  id: string;
  contractorId: string;
  organizationId: string;
  workGroupId: string;
  workGroupName: string;
  compliantEmployeeCount: number;
  totalEmployeeCount: number;
  compliantEmployeePercentage: number;
  employeeCountUpdatedDateUtc: string;
  isDeleted: boolean;
  workGroup: IWorkGroup;
}
