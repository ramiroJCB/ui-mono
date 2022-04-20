import * as faker from 'faker';
import { IBusinessUnit } from '../src/interfaces/businessUnit';
import { safetyProgramClients } from './safetyProgramClients';

export const safetyProgramBusinessUnits: IBusinessUnit[] = Array(10)
  .fill({})
  .map(() => ({
    id: faker.random.uuid(),
    clientId: faker.random.arrayElement(safetyProgramClients.slice(0, 10)).id,
    description: faker.commerce.department()
  }));
