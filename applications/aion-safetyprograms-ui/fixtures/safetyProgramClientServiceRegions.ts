import * as faker from 'faker';
import { IClientServiceRegion } from '../src/interfaces/clientServiceRegion';
import { safetyProgramClients } from './safetyProgramClients';

const clientId = safetyProgramClients[0].id;

export const safetyProgramClientServiceRegions: IClientServiceRegion[] = Array(15)
  .fill({})
  .map(() => ({
    id: faker.random.uuid(),
    clientId,
    serviceRegionId: faker.random.uuid(),
    serviceRegionName: faker.random.words(2)
  }));
