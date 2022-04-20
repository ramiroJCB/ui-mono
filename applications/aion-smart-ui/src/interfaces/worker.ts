// PLURAL (GET) for finding someone by PEC ID
// /api/v1/employees?pecIdentifier='PEC123456789'

// PLURAL (GET) for getting a list of checked in workers on a site
// /api/v1/organizations(organizationId)/sites(siteId)/workers?$filter=status eq 'CheckedIn'

// PLURAL (GET) even though the UI only cares about the first result
// /api/v1/organizations(organizationId)/sites(siteId)/workers?$filter=employeeId eq 'employeeId'

// SINGULAR (GET, PUT)
// /api/v1/organizations(organizationId)/sites(siteId)/workers(workerId)

export enum WorkerStatus {
  CheckedIn = 'CheckedIn',
  CheckedOut = 'CheckedOut',
  Injured = 'Injured',
  Rejected = 'Rejected'
}

export interface IWorker {
  id: string;
  siteId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  organizationId: string;
  organizationName?: string;
  mobilePhoneNumber: string | null;
  pecIdentifier: number | null;
  lastUpdatedDate: string | null;
  status: WorkerStatus | null;
  // TODO: Remove '?' when we have back-end support
  livesOnSite?: boolean;
}
