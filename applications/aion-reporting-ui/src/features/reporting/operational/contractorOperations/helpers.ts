import { DeepReadonly } from 'utility-types';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { IOperationalMetricValue } from 'interfaces/operationalMetricValue';

export const mapOperationalMetrics = (
  metrics: DeepReadonly<IOperationalMetric[]>,
  metricValues: DeepReadonly<IOperationalMetricValue[]>
): IMappedOperationalMetric[] =>
  metrics.map(metric => {
    const value = metricValues.find(metricValue => metric.id === metricValue.operationalMetricId);

    return value ? { ...metric, metricValueId: value.id, value: value.value } : { ...metric };
  });
