import { IMetricValue } from './metricValue';

export interface IOperationalMetricValue extends IMetricValue {
  operationalMetricId: string;
  value: number | null;
}
