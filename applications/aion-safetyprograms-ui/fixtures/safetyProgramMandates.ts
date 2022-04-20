import * as faker from 'faker';
import { IExpandedMandate } from '../src/interfaces/mandate';
import { safetyProgramBusinessUnits } from './safetyProgramBusinessUnits';
import { safetyProgramClients } from './safetyProgramClients';
import { safetyProgramRegionalServices } from './safetyProgramRegionalServices';
import { safetyPrograms } from './safetyPrograms';

export const safetyProgramMandates: IExpandedMandate[] = Array(100)
  .fill({})
  .map(() => {
    const client = faker.random.arrayElement(safetyProgramClients);
    const safetyProgram = faker.random.arrayElement(safetyPrograms);
    const assigneesType = faker.random.arrayElement(['allContractors', 'businessUnits', 'services']);

    return {
      id: faker.random.uuid(),
      clientId: client.id,
      clientName: client.name,
      safetyProgramId: safetyProgram.id,
      safetyProgramTitle: safetyProgram.title,
      safetyProgram,
      client,
      businessUnits: assigneesType === 'businessUnits' ? safetyProgramBusinessUnits : [],
      regionalServices: assigneesType === 'services' ? safetyProgramRegionalServices.slice(0, 20) : [],
      createdBy: faker.internet.userName(),
      updatedBy: faker.internet.userName(),
      createdDateUtc: faker.date.past().toISOString(),
      updatedDateUtc: faker.date.past().toISOString()
    };
  });
