import { IOperationalMetric } from '../src/interfaces/operationalMetric';
import { MetricValueType } from '../src/interfaces/metricValue';

export const operationalMetrics: { value: IOperationalMetric[] } = {
  value: [
    {
      id: '4e56182f-528b-4934-8fb1-b123f392af06',
      name: 'Metric A',
      valueType: MetricValueType.Boolean
    },
    {
      id: '5a24b30f-737a-441f-b46f-6122512f1b2e',
      name: 'Metric B',
      valueType: MetricValueType.Double
    },
    {
      id: '14d451ad-1629-43e8-adad-d3735bea7bc4',
      name: 'Metric C',
      valueType: MetricValueType.Double
    }
  ]
};
