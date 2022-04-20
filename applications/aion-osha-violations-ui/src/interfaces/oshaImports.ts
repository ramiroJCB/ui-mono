export enum OshaEtlStatus {
  Running = 0,
  Success = 1,
  Failure = 2
}

export interface IOshaImport {
  id: string;
  runDateTimeUtc: string;
  status: OshaEtlStatus;
  failureReason: string;
  endDateTimeUtc: string;
  inspectionsFileName: string;
  violationsFileName: string;
  totalCountInspections: number;
  totalCountViolations: number;
  totalCountNewInspections: number;
  totalCountNewViolations: number;
  totalCountUpdatedInspections: number;
  totalCountUpdatedViolations: number;
  createdBy: string;
  updatedBy: string;
  createdDateUtc: string;
  updatedDateUtc: string;
}
