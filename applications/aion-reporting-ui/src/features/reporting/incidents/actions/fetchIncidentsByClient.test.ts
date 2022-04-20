import axios from 'axios';
import { fetchIncidentsByClient } from '../../incidents/actions/fetchIncidentsByClient';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from '../../../../combineReducers';
const organizationId = '08eaa1e1-dffc-4736-ac4f-a8d900e15ffe';
const urlQuery: ParsedUrlQuery = {
  start: '2018-05-30T18:32:34Z',
  end: '2019-05-31T04:59:59Z',
  incidentCategoryIds: '471b83bb-a0fb-4dea-a67a-aa1400fa1539',
  page: '1'
};
describe('fetch incidents by client', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params to fetch incidents by client', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: {}, headers: {} })));

    await fetchIncidentsByClient(organizationId, urlQuery)(
      () => null,
      () => ({} as RootState),
      null
    );
    expect(axios.get).toHaveBeenCalledWith('/api/v3.01/incidents', {
      params: {
        $filter: `incidentCategoryId in ('471b83bb-a0fb-4dea-a67a-aa1400fa1539') and (clientId eq 08eaa1e1-dffc-4736-ac4f-a8d900e15ffe) and (occurredOnDateUtc ge 2018-05-30T18:32:34Z) and (occurredOnDateUtc le 2019-05-31T04:59:59Z)`,
        $orderBy: 'occurredOnDateUtc desc',
        $skip: 0,
        $top: 10,
        includeMetadata: true
      }
    });
  });
});
