import * as faker from 'faker';
import { forms } from './forms';
import { formSections } from './formSections';
import { IElement } from '../src/interfaces/element';
import { randomComponentType, randomElementSchema } from './helpers';

export const formElements: IElement[] = Array(faker.random.number(10))
  .fill({})
  .map((_item, index) => ({
    id: faker.random.uuid(),
    formId: forms[0].id,
    sectionId: formSections[0].id,
    title: faker.random.word(),
    description: faker.lorem.sentence(),
    isRequired: faker.random.boolean(),
    options: null,
    component: randomComponentType(),
    schema: randomElementSchema(),
    embeddedMediaMetadata: [],
    sortOrder: index + 1
  }));
