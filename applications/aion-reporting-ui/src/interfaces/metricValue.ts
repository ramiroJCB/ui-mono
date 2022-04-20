export enum MetricValueType {
  Double = 'Double',
  Boolean = 'Boolean'
}

export enum BooleanMetricValue {
  True = 1,
  False = 0
}

export interface IMetricValue {
  id: string;
  periodId: string;
  contractorId: string;
  contractorName: string;
  isDeleted: boolean;
}
