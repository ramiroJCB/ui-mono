import { IEmployee } from './employee';

export interface IWorkGroupJobTypeEmployee {
  id: string;
  jobTypeName: string;
  workGroupJobTypeId: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  compliantTrainingCount: number;
  totalTrainingCount: number;
  compliantTrainingPercentage: number;
  trainingCountUpdatedDateUtc: string;
  employee?: IEmployee;
  contractorId: string;
}
