export interface IProgramStatus {
  id: string;
  createdDateUtc: string;
  totalCount: number;
  acceptedCount: number;
  acceptedNaCount: number;
  readyToSubmitCount: number;
  incompleteCount: number;
  rejectedCount: number;
  rejectedNaCount: number;
  pendingReviewCount: number;
  exceptionsGrantedCount: number;
  speCompliance: number;
  vfResponsible: number;
  contractorResponsible: number;
  ableToImpact: number;
  percentImpacted: number;
}
