import { BooleanMetricValue, IMetricValue } from './metricValue';

export interface IRegionalMetricValue extends IMetricValue {
  regionalMetricId: string;
  regionId: string;
  value: number | null | BooleanMetricValue;

  // TODO: Require these after the API is released
  meta?: {
    isHidden: boolean;
    isRequired: boolean;
  };
}
