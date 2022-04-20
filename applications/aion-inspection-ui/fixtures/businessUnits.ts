import * as faker from 'faker';
import { IBusinessUnit } from '../src/interfaces/businessUnit';

export const businessUnits = Array<IBusinessUnit | null>(10)
  .fill(null)
  .map(() => ({
    id: faker.random.uuid(),
    businessUnitId: faker.random.uuid(),
    businessUnitName: faker.random.word(),
    contractorId: faker.random.uuid(),
    clientId: faker.random.uuid(),
    updatedDateUtc: ''
  }));
