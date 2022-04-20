import { BooleanMetricValue, MetricValueType } from './metricValue';

export interface IMappedMetric {
  id: string;
  name: string;
  value?: number | null | BooleanMetricValue;
  metricValueId?: string;

  // TODO: Require this after the API is released
  valueType?: MetricValueType;
  doesUnlockRow?: boolean;
  requiresConfirmation?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
}
