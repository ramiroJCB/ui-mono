export interface IWorkerDetail {
  id: string;
  workerId: string;
  siteId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  pecIdentifier: string;
  organizationId: string;
  contractorId: string;
  contractorName: string;
  dateTimeIn: string;
  dateTimeOut: string;
  exposureDuration: number;
  injuredOnLocation: boolean;
  siteName: string;
  siteTags: string;
  contractorStatus: string;
  contractorStatusColor: string;
  safeLand: boolean;
  safeGulf: boolean;
  h2SClear: boolean;
  coreCompliance: boolean;
  workGroupJobTypes: {
    jobTypeId: string;
    jobTypeName: string;
    workGroupId: string;
    workGroupName: string;
  }[];
}
