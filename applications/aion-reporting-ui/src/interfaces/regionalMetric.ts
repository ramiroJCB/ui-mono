import { MetricValueType } from './metricValue';

export interface IRegionalMetric {
  id: string;
  name: string;

  // TODO: Require these after the API is released
  valueType?: MetricValueType;
  doesUnlockRow?: boolean;
  requiresConfirmation?: boolean;
}
