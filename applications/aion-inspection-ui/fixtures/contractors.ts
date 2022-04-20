import * as faker from 'faker';
import { IContractor } from '../src/interfaces/contractor';
import { OrganizationFeature } from '../../../packages/aion-ui-core/src/interfaces/organization';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Subscriber } = OrganizationFeature;

export const contractors: IContractor[] = [];

organizations
  .filter(org => org.features.includes(Subscriber))
  .map(({ id, name }) =>
    contractors.push({
      id,
      name,
      hasQualifiedEmployees: faker.random.boolean()
    })
  );

for (let i = 0; i < 30; i += 1) {
  contractors.push({
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    hasQualifiedEmployees: faker.random.boolean()
  });
}
