import { MetricValueType } from './metricValue';

export interface IMappedOperationalMetric {
  id: string;
  name: string;
  value?: number | null;
  valueType: MetricValueType;
  metricValueId?: string;
}
