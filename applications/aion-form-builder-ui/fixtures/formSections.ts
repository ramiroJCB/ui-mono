import * as faker from 'faker';
import { forms } from './forms';
import { ISection } from '../src/interfaces/section';

export const formSections: ISection[] = Array(faker.random.number(18))
  .fill({})
  .map((_item, index) => ({
    id: faker.random.uuid(),
    formId: forms[0].id,
    name: faker.random.word(),
    description: faker.lorem.sentence(),
    embeddedMediaMetadata: [],
    sortOrder: index + 1
  }));
