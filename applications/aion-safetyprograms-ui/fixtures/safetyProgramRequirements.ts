import * as faker from 'faker';
import { IExpandedRequirement } from '../src/interfaces/requirement';
import { randomRequirementStatus } from './helpers';
import { safetyProgramClients } from './safetyProgramClients';
import { safetyPrograms } from './safetyPrograms';

const clients = safetyProgramClients.slice(0, 5);

export const safetyProgramRequirements: IExpandedRequirement[] = safetyPrograms.map(safetyProgram => {
  const id = faker.random.uuid();

  return {
    clients,
    clientScoreOverrides: clients.map(client => ({
      id: faker.random.uuid(),
      clientId: client.id,
      safetyProgramRequirementId: id,
      isOverridden: faker.random.boolean()
    })),
    hasUnreadEvaluatorComments: faker.random.boolean(),
    hasUnreadContractorComments: faker.random.boolean(),
    contractorCompanyNumber: faker.random.arrayElement([null, faker.random.number(99999)]),
    contractorId: '0b7319a1-4571-4940-aabd-5b4d42bc086f',
    contractorName: 'Auntie Chesterine’s Cupcake Emporium',
    numberOfComments: faker.random.number({ min: 1, max: 10 }),
    numberOfClients: clients.length,
    id,
    lastContractorActivityDateUtc: faker.random.arrayElement([null, faker.date.past().toISOString()]),
    safetyProgramId: safetyProgram.id,
    safetyProgramTitle: safetyProgram.title,
    status: randomRequirementStatus()
  };
});
