import { BooleanMetricValue, MetricValueType } from '../src/interfaces/metricValue';
import { contractorPeriods } from './contractorPeriods';
import { IRegionalMetricValue } from '../src/interfaces/regionalMetricValue';
import { random } from 'faker';
import { regionalMetrics } from './regionalMetrics';
import { regions } from './regions';

const { True, False } = BooleanMetricValue;

export const regionalMetricValues: { value: IRegionalMetricValue[] } = { value: [] };

regions.value.map(region =>
  regionalMetrics.value.map(({ id, valueType }) =>
    regionalMetricValues.value.push({
      id: random.uuid(),
      regionId: region.id,
      regionalMetricId: id,
      periodId: contractorPeriods[0].id,
      contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
      contractorName: 'Initech',
      value: valueType === MetricValueType.Boolean ? random.arrayElement([True, False]) : random.number({ min: 0 }),
      isDeleted: false,
      meta: {
        isHidden: false,
        isRequired: true
      }
    })
  )
);
