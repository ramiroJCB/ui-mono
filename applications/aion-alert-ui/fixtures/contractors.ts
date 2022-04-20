import * as faker from 'faker';
import { IContractor } from '../src/interfaces/contractor';
import { ITag } from '../src/interfaces/tag';
import { OrganizationFeature } from '../../../packages/aion-ui-core/src/interfaces/organization';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures/organizations';

const { Subscriber } = OrganizationFeature;

export const contractors: IContractor[] = [];

const generateTags = () => {
  const tags: ITag[] = [];

  for (let i = 0; i < faker.random.number({ max: 10 }); i += 1) {
    tags.push({
      id: faker.random.uuid(),
      name: faker.company.bsBuzz()
    });
  }

  return tags;
};

organizations
  .filter(org => org.features.includes(Subscriber))
  .map(({ id, name }) =>
    contractors.push({
      id,
      name,
      tags: generateTags()
    })
  );

for (let i = 0; i < 100; i += 1) {
  contractors.push({
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    tags: generateTags()
  });
}
