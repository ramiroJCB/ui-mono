import * as faker from 'faker';
import { IIncidentWorkGroup, IncidentWorkGroupStatus } from '../src/interfaces/incidentWorkGroup';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Active, Inactive } = IncidentWorkGroupStatus;

export const incidentWorkGroups: IIncidentWorkGroup[] = [
  {
    id: 'c2fd5129-cbd5-4602-843e-b2c9fdf6edc2',
    name: 'Work Group 1',
    status: Active,
    description: faker.lorem.sentence(),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '9810181c-38f5-44fa-a321-39827fae18d3',
    name: 'Work Group 2',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: '7a607dfd-f811-4b1d-905a-ed79a493507d',
    name: 'Work Group 3',
    status: Inactive,
    description: faker.lorem.sentence(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f548e0d9-4034-47da-9a02-772d72b82d21',
    name: 'Work Group 4',
    status: Active,
    description: faker.lorem.words(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '2e8eeb4f-3629-4616-896e-f93185e96a35',
    name: 'Work Group 5',
    status: Active,
    description: faker.lorem.paragraph(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '882e3f0f-697e-4c99-a39a-ef05580e3beb',
    name: 'Work Group 6',
    status: Active,
    description: faker.lorem.sentence(6),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'c19bf1ce-aa6c-4aae-b21c-02b14e2c7ec1',
    name: 'Work Group 7',
    status: Inactive,
    description: faker.lorem.words(6),
    clientId: organizations[3].id,
    isDeleted: false
  }
];
