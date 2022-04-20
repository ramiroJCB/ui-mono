import * as faker from 'faker';
import { IContractor } from '../src/interfaces/contractor';

export const safetyProgramContractors: IContractor[] = Array(100)
  .fill({})
  .map(() => ({
    createdBy: faker.internet.userName(),
    createdDateUtc: faker.date.past().toISOString(),
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    updatedBy: faker.internet.userName(),
    updatedDateUtc: faker.date.past().toISOString()
  }));
