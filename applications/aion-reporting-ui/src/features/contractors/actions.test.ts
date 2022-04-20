import axios from 'axios';
import { fetchContractors } from './actions';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from '../../combineReducers';
const organizationId = '';
const featureFilter: OrganizationFeature = OrganizationFeature.IncidentReports;
const contractorIds: string[] = ['d6d74a5b-76c0-4499-b1a7-a8d900e14f89', '486ff748-023a-4e7f-90c4-a8d900e152c6'];
describe('fetches contractors', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params to fetch contractors', async () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: {}, headers: {} })));

    await fetchContractors(organizationId, featureFilter, contractorIds)(
      () => null,
      () => ({} as RootState),
      null
    );
    expect(axios.get).toHaveBeenCalledWith(`/api/v2/organizations/${organizationId}/contractors`, {
      params: {
        $filter: `contractorId in ('d6d74a5b-76c0-4499-b1a7-a8d900e14f89','486ff748-023a-4e7f-90c4-a8d900e152c6')`,
        featureFilter: OrganizationFeature.IncidentReports
      }
    });
  });
});
