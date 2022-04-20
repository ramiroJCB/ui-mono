import * as faker from 'faker';
import { ITag } from '../src/interfaces/tag';

export const tags: ITag[] = [];

for (let i = 0; i < 10; i += 1) {
  tags.push({
    id: faker.random.uuid(),
    name: faker.company.bsBuzz()
  });
}
