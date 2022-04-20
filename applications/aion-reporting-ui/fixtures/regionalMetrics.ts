import { IRegionalMetric } from '../src/interfaces/regionalMetric';
import { MetricValueType } from '../src/interfaces/metricValue';

const { Double } = MetricValueType;

export const regionalMetrics: { value: IRegionalMetric[] } = {
  value: [
    {
      id: '4852b2ef-8445-4070-b422-cc3ec207ebe9',
      name: 'Work Performed?',
      valueType: MetricValueType.Boolean,
      doesUnlockRow: true,
      requiresConfirmation: false
    },
    {
      id: '4e56182f-528b-4934-8fb1-b123f392af06',
      name: 'Construction / Facilities',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '5a24b30f-737a-441f-b46f-6122512f1b2e',
      name: 'Drilling',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '3d08a42f-5214-40e5-9a04-7c359a309126',
      name: 'Fatalities',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: true
    },
    {
      id: '14d451ad-1629-43e8-adad-d3735bea7bc4',
      name: 'Maintenance',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '12c84f3d-d69c-4a30-b3c5-62831dd60a23',
      name: 'Power Plant',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: 'd58fba66-230c-49b1-8049-7919e7f34eeb',
      name: 'Surface Operations',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '18b9f98a-eeeb-4881-8bca-04816d2e2fa3',
      name: 'Transportation / Warehouse',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '2956c8aa-9429-4d6b-9ed4-80114865fbce',
      name: 'Well Service',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    },
    {
      id: '36b426de-a559-4dd6-bf23-966e85aad15a',
      name: 'Other',
      valueType: Double,
      doesUnlockRow: false,
      requiresConfirmation: false
    }
  ]
};
