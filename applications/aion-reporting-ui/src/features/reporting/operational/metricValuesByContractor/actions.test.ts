import axios from 'axios';
import { fetchOperationalMetricValuesByContractor } from '../../operational/metricValuesByContractor/actions';
import { IOperationalMetric } from '../../../../interfaces/operationalMetric';
import { RootState } from '../../../../combineReducers';
const periodId = '4422410c-83c9-4ab1-91a0-aa400000293b';
const contractorId = '3d485f4d-8f39-4f78-a83f-a8d900e15e2b';
const selectedOperationalMetrics: IOperationalMetric[] = [
  { id: '45a6a113-a777-4107-a425-f17c4d7ea9ea', name: 'CRC HSE Meetings Attended by Leadership', valueType: 'Double' }
];
const search = '';
describe('fetch ', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params to fetch operational metrics', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { value: [] }, headers: {} })));

    await fetchOperationalMetricValuesByContractor(
      periodId,
      contractorId,
      selectedOperationalMetrics,
      search
    )(
      () => null,
      () => ({} as RootState),
      null
    );
    expect(axios.get).toHaveBeenCalledWith(
      '/api/v3.01/organizations(3d485f4d-8f39-4f78-a83f-a8d900e15e2b)/operationalMetricValues',
      {
        params: {
          $filter: `operationalMetricId in ('45a6a113-a777-4107-a425-f17c4d7ea9ea') and (periodId eq 4422410c-83c9-4ab1-91a0-aa400000293b)`
        }
      }
    );
  });
});
