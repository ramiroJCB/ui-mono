export interface IPredictiveRanking {
  organizationId: string;
  score: number;
  riskDataImpacts: IRiskDataImpact[];
}

export interface IRiskDataImpact {
  name: string;
  value: string;
  weight: number;
  shortDescription: string;
  longDescription: string;
}
