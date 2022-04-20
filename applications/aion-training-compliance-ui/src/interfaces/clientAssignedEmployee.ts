export interface IClientAssignedEmployee {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  contractorName: string;
  compliantTrainingCount: number;
  totalTrainingCount: number;
  compliantTrainingPercentage: number;
  trainingCountUpdatedDateUtc: string;
  isDeleted: boolean;
}
