import * as faker from 'faker';
import { IClient } from '../src/interfaces/client';

export const safetyProgramClients: IClient[] = Array(100)
  .fill({})
  .map(() => ({
    createdBy: faker.internet.userName(),
    createdDateUtc: faker.date.past().toISOString(),
    id: faker.random.uuid(),
    mandateCount: faker.random.number(20),
    name: faker.company.companyName(),
    updatedBy: faker.internet.userName(),
    updatedDateUtc: faker.date.past().toISOString()
  }));
