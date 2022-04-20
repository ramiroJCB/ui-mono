import * as faker from 'faker';
import { contractorPeriods } from './contractorPeriods';
import { IOperationalMetricValue } from '../src/interfaces/operationalMetricValue';
import { MetricValueType } from '../src/interfaces/metricValue';
import { operationalMetrics } from './operationalMetrics';

export const operationalMetricValues: { value: IOperationalMetricValue[] } = { value: [] };

operationalMetrics.value.map(metric =>
  operationalMetricValues.value.push({
    id: faker.random.uuid(),
    operationalMetricId: metric.id,
    periodId: contractorPeriods[0].id,
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech',
    value: faker.random.number({ min: 0, max: metric.valueType === MetricValueType.Boolean ? 1 : undefined }),
    isDeleted: false
  })
);
