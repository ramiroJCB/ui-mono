import * as faker from 'faker';
import { IIncidentRootCause, IncidentRootCauseStatus } from '../src/interfaces/incidentRootCause';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { Active, Inactive } = IncidentRootCauseStatus;

export const incidentRootCauses: IIncidentRootCause[] = [
  {
    id: 'd7607a61-b9d1-44cf-8147-ea8c62aa8d13',
    name: 'Unknown',
    status: Active,
    description: faker.lorem.sentence(),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'f53a2131-b039-4f08-b082-78652ed423bf',
    name: 'Inadequate Training',
    status: Active,
    description: faker.lorem.sentence(8),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'b270a5af-9b9d-4eb8-9358-509bef4bf1ea',
    name: 'Ignored safety precautions',
    status: Inactive,
    description: faker.lorem.sentence(6),
    clientId: organizations[0].id,
    isDeleted: false
  },
  {
    id: 'e3e23f92-2226-45f0-981b-2fd012804101',
    name: 'Inadequate Training',
    status: Active,
    description: faker.lorem.words(2),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: 'e2229e03-fdd3-47be-bc78-f800ef584e98',
    name: 'Unknown',
    status: Active,
    description: faker.lorem.paragraph(3),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '2173bff6-537c-4a0a-8b0f-05a0d974a9dd',
    name: 'Hazardous Job Site',
    status: Active,
    description: faker.lorem.sentence(6),
    clientId: organizations[3].id,
    isDeleted: false
  },
  {
    id: '0872b0c0-e8d8-4f3c-ac0a-6adfc2ec7e65',
    name: 'Some Deactivated RootCause for Company 2',
    status: Inactive,
    description: faker.lorem.words(6),
    clientId: organizations[3].id,
    isDeleted: false
  }
];
