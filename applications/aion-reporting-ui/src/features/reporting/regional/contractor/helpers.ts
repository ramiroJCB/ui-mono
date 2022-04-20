import { DeepReadonly } from 'utility-types';
import { IMappedRegionMetrics } from 'interfaces/mappedRegionMetrics';
import { IRegion } from 'interfaces/region';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { IRegionalMetricValue } from 'interfaces/regionalMetricValue';

export const mapRegionMetrics = (
  regions: DeepReadonly<IRegion[]>,
  metrics: DeepReadonly<IRegionalMetric[]>,
  metricValues: DeepReadonly<IRegionalMetricValue[]>
): IMappedRegionMetrics[] =>
  regions.map(region => {
    const mappedMetrics = metrics.map(metric => {
      const value = metricValues.find(
        metricValue => region.id === metricValue.regionId && metric.id === metricValue.regionalMetricId
      );

      return value ? { ...metric, metricValueId: value.id, value: value.value, ...value.meta } : { ...metric };
    });

    return {
      ...region,
      metrics: mappedMetrics
    };
  });
