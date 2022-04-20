import axios from 'axios';
import { fetchOperationalContractors } from '../../../reporting/operational/contractors/actions';
import { RootState } from '../../../../combineReducers';
const organizationId = '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe';
const periodId = '4422410c-83c9-4ab1-91a0-aa400000293b ';
const contractorIds: string[] = [
  '54e367e5-a5a1-4d9a-93ff-a8d900e15856',
  'b274fe74-99c1-412c-ae95-a8d900e158ba',
  '6e092d6c-b71d-4f50-b26f-a8d900e143a7'
];

describe('fetch operational contractors', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params to fetch contractors', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: { value: [] }, headers: {} })));

    await fetchOperationalContractors(organizationId, periodId, contractorIds, { page: '1' })(
      () => null,
      () => ({ clientPeriods: {} } as RootState),
      null
    );
    expect(axios.get).toHaveBeenCalledWith('/api/v3.01/operationalContractorPeriods', {
      params: {
        $filter: `contractorId in ('54e367e5-a5a1-4d9a-93ff-a8d900e15856','b274fe74-99c1-412c-ae95-a8d900e158ba','6e092d6c-b71d-4f50-b26f-a8d900e143a7') and (clientId eq 08eaa1e1-dffc-4736-ac4f-a8d900e15ffe) and (periodId eq 4422410c-83c9-4ab1-91a0-aa400000293b )`,
        $orderby: 'contractorName',
        $skip: 0,
        $top: 10,
        _limit: 10,
        _page: '1'
      }
    });
  });
});
