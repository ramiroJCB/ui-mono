import { MetricValueType } from './metricValue';

export interface IOperationalMetric {
  id: string;
  name: string;
  valueType: MetricValueType;
}
