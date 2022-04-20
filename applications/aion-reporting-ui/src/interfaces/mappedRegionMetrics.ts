import { IMappedMetric } from './mappedMetric';

export interface IMappedRegionMetrics {
  id: string;
  name: string;
  metrics: IMappedMetric[];
}
