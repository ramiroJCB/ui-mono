import * as faker from 'faker';
import { IMetricContractor } from '../src/interfaces/metricContractor';
import { OrganizationFeature } from '../../../packages/aion-ui-core/src/interfaces/organization';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';
import { PeriodStatus } from '../src/interfaces/contractorPeriod';

const { Submitted } = PeriodStatus;
const { Subscriber } = OrganizationFeature;

export const metricContractors: IMetricContractor[] = [];

organizations
  .filter(org => org.features.includes(Subscriber))
  .map(({ id, name }) =>
    metricContractors.push({
      id,
      name,
      metricStatus: Submitted,
      metricStatusUpdatedDateUtc: null,
      metricValuesTotal: faker.random.number({ min: 0 }),
      isEditedAfterDeadline: name === 'Initech' ? true : false
    })
  );

for (let i = 0; i < 30; i += 1) {
  metricContractors.push({
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    metricStatus: Submitted,
    metricStatusUpdatedDateUtc: null,
    metricValuesTotal: faker.random.number({ min: 0 }),
    isEditedAfterDeadline: false
  });
}
