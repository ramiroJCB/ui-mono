import * as faker from 'faker';
import { IIncidentCategory, IncidentCategoryStatus } from '../src/interfaces/incidentCategory';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Active, Inactive } = IncidentCategoryStatus;

export const incidentCategories: IIncidentCategory[] = [
  {
    id: '71e03d77-0e50-4070-9402-fb0840f68612',
    name: 'Near Miss',
    status: Active,
    description: faker.lorem.sentence(),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '04441ab7-75bd-4848-b26f-63134790d5b8',
    name: 'Stop Work Authority',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '850e4889-a833-4c4d-9e09-f700f863ea26',
    name: 'Some Deactivated Category',
    status: Inactive,
    description: faker.lorem.sentence(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '92e9beda-6f18-4986-8624-89b6f8902f53',
    name: 'Code Red',
    status: Active,
    description: faker.lorem.words(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'e91414b3-e651-4ecb-add6-933441388fc8',
    name: 'Code Orange',
    status: Active,
    description: faker.lorem.paragraph(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'f7c71ea5-e5fb-4b6d-b50b-f734b34c4a55',
    name: 'Code Green',
    status: Active,
    description: faker.lorem.sentence(6),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '359923a2-86b7-4bdb-84f8-c3b02d566325',
    name: 'Some Deactivated Category for Company 2',
    status: Inactive,
    description: faker.lorem.words(6),
    clientId: organizations[3].id,
    isDeleted: false
  }
];
