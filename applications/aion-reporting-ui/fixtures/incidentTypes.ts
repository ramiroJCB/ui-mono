import * as faker from 'faker';
import { IIncidentType, IncidentTypeStatus } from '../src/interfaces/incidentType';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Active, Inactive } = IncidentTypeStatus;

export const incidentTypes: IIncidentType[] = [
  {
    id: '0fdfccef-1ecf-4536-89b3-356958ee559e',
    name: 'Tools/Equipment',
    status: Active,
    description: faker.lorem.sentence(),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'df6f4f61-2738-423e-9687-d4b97bd2c663',
    name: 'PPE',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '9c9c91dc-bed6-466b-8367-d3e5aa8acdf0',
    name: 'Slips Trips and Falls',
    status: Active,
    description: faker.lorem.sentence(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'e1b6e02c-bd22-4b3a-b7b1-116f3d872f1e',
    name: 'Lock Out Tag Out',
    status: Active,
    description: faker.lorem.paragraph(2),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'a527bd1d-134f-4526-82de-cccbea78e66e',
    name: 'Pinch Points',
    status: Active,
    description: faker.lorem.sentence(19),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f00eaa5b-172e-4b48-ad32-ededff27ca7a',
    name: 'Line of Fire',
    status: Active,
    description: faker.lorem.sentence(10),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'b333ed39-929e-4dd5-bb4b-6991a6b78e53',
    name: 'Falling/Overhead',
    status: Active,
    description: faker.lorem.sentence(22),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '85d3f024-613c-40a2-b93d-7e30884327b1',
    name: 'Driving',
    status: Active,
    description: faker.lorem.paragraph(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '9f26be8a-0393-4533-ae00-f0df5be88a1a',
    name: 'Lifting',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f58fa681-2c66-4a07-99c4-2eca1809de76',
    name: 'Environmental',
    status: Active,
    description: faker.lorem.sentence(9),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'a6904be9-fe8a-4af3-ab8e-73c6c6245da0',
    name: 'House Keeping',
    status: Active,
    description: faker.lorem.sentence(14),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'b544af96-5fce-49ae-92ba-9bc7ae08c376',
    name: 'Trapped Pressure',
    status: Active,
    description: faker.lorem.sentence(29),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '9d1ae9d9-6bb2-4439-9bb9-74f3779d2961',
    name: 'Working Surfaces',
    status: Active,
    description: faker.lorem.sentence(1),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f8bebdcd-c2dd-4efa-8311-ebe9cc63dd6f',
    name: 'H2S',
    status: Active,
    description: faker.lorem.sentence(2),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f409e3ee-cc2f-470e-8f91-024ba5b34d08',
    name: 'Other',
    status: Active,
    description: faker.lorem.paragraph(2),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'b6bc751e-38c2-47dd-b8b8-7ba8c3954c45',
    name: 'Inactive Type #1',
    status: Inactive,
    description: faker.lorem.sentence(16),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '4ad5cfb5-5edf-4d6a-92a5-bb8acb4cc175',
    name: 'Inactive Type #2',
    status: Inactive,
    description: faker.lorem.sentence(11),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '9aeaa421-5309-465e-a642-d9554b5f6102',
    name: 'Inactive Type #3',
    status: Inactive,
    description: faker.lorem.sentence(5),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '334e981a-7a07-4dcc-b35d-96ec04169e42',
    name: 'Slips/Falls',
    status: Active,
    description: faker.lorem.sentence(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'd50e8fd2-21da-4d5c-a5cf-565a6c7c57e7',
    name: 'Repetitive Strain injury',
    status: Active,
    description: faker.lorem.paragraph(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '22ff5169-9be0-4198-b884-d17d678c66d4',
    name: 'Crashes and collisions',
    status: Active,
    description: faker.lorem.sentence(16),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '18ccb4ac-3cd1-442e-a2ee-2b227d284393',
    name: 'Inhaling Toxic Fumes',
    status: Active,
    description: faker.lorem.words(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '52131778-b194-4393-8c75-841c22e02420',
    name: 'Being hit by falling object',
    status: Active,
    description: faker.lorem.paragraph(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '7bbd0621-8e07-4886-9e34-85fb27520a4c',
    name: 'Cuts and lacerations',
    status: Active,
    description: faker.lorem.words(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'b47b1787-982d-4462-9772-f85aff8fbd0a',
    name: 'Exposure to loud noise',
    status: Active,
    description: faker.lorem.sentence(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'c60bc73f-0284-48e9-ad28-a25db0cc0c8e',
    name: 'Inactive Type for Company 2',
    status: Inactive,
    description: faker.lorem.sentence(5),
    clientId: organizations[3].id,
    isDeleted: false
  }
];
