import * as faker from 'faker';
import { IRegionalService } from '../src/interfaces/regionalService';
import { safetyProgramClientServiceRegions } from './safetyProgramClientServiceRegions';

const { serviceRegionId, serviceRegionName } = safetyProgramClientServiceRegions[0];

export const safetyProgramRegionalServices: IRegionalService[] = Array(1000)
  .fill({})
  .map(() => ({
    id: faker.random.uuid(),
    serviceId: faker.random.uuid(),
    serviceName: faker.random.words(4),
    serviceRegionId,
    serviceRegionName
  }));
