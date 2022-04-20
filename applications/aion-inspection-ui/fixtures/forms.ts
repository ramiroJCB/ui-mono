import * as faker from 'faker';
import { IForm } from '../src/interfaces/form';

export const forms: IForm[] = [
  {
    id: '2be4793b-989c-4c25-8dfc-a1ae231f2c01',
    formCode: faker.random.alphaNumeric(10),
    organizationId: faker.random.uuid(),
    name: 'Form 6350',
    description: faker.random.words()
  },
  {
    id: '44472616-aa7a-499d-b9f5-12e9078c7d97',
    formCode: faker.random.alphaNumeric(10),
    organizationId: faker.random.uuid(),
    name: 'Form 2849',
    description: faker.random.words()
  }
];
