import * as faker from 'faker';
import { IIncidentRegion, IncidentRegionStatus } from '../src/interfaces/incidentRegion';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Active, Inactive } = IncidentRegionStatus;

export const incidentRegions: IIncidentRegion[] = [
  {
    id: '81de3624-8793-488c-bea3-0321ba774a79',
    name: 'Central Valley',
    status: Active,
    description: faker.lorem.sentence(),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '2abefd1e-2d2e-4b2f-b04f-b3c4be5a8392',
    name: 'Elk Hills',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'df7b70ae-47e4-45d2-9287-5cd34c937566',
    name: 'Kettleman',
    status: Inactive,
    description: faker.lorem.sentence(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '2ef9545a-1a45-4f44-90ed-cbc30fd7cd78',
    name: 'LA Basin Huntington Beach',
    status: Active,
    description: faker.lorem.words(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '538d42be-3423-46dd-9291-87d345a626bb',
    name: 'Sacramento Basin',
    status: Active,
    description: faker.lorem.paragraph(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '12e95c33-e8ad-4eda-ab7e-f51ada9674b7',
    name: 'South Valley',
    status: Active,
    description: faker.lorem.sentence(6),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '4152fb65-77d1-4d1a-ab45-ff74b0c0294d',
    name: 'Thermal Operations',
    status: Inactive,
    description: faker.lorem.words(6),
    clientId: organizations[3].id,
    isDeleted: false
  }
];
