import { EmployeeStatus, IEmployeeWithOrganization } from '../../../packages/aion-ui-core/src/interfaces/employee';
import { organizations, trainees } from '../../../packages/aion-ui-core/src/fixtures';

const filler = {
  organizationEmployeeId: null,
  status: EmployeeStatus.Active,
  startDate: '',
  comments: null,
  createdDate: '',
  updatedDate: '',
  isDeleted: false
};

export const employees: IEmployeeWithOrganization[] = [
  {
    ...filler,
    id: 'fc17be8f-c6d7-4b3d-8e96-2b4fb9e1bb9e',
    organizationId: organizations[0].id,
    traineeId: trainees[0].id,
    organization: organizations[0]
  },
  {
    ...filler,
    id: '8abfcec8-67b3-4b18-81fc-99731e3cc2b6',
    organizationId: organizations[0].id,
    traineeId: trainees[1].id,
    organization: organizations[0]
  },
  {
    ...filler,
    id: 'ab7ea28f-51b2-47ec-a379-047d488f3311',
    organizationId: organizations[0].id,
    traineeId: trainees[2].id,
    organization: organizations[0]
  },
  {
    ...filler,
    id: '80aeae1e-e953-441f-af22-3dac3c4867bb',
    organizationId: organizations[0].id,
    traineeId: trainees[3].id,
    organization: organizations[0]
  },
  {
    ...filler,
    id: 'b31da3db-1056-47bc-aa79-6cb317e3e353',
    organizationId: organizations[0].id,
    traineeId: trainees[4].id,
    organization: organizations[0]
  },
  {
    ...filler,
    id: '7cb74723-02f1-4145-8d1f-d1a669ecb276',
    organizationId: organizations[1].id,
    organization: organizations[1],
    traineeId: trainees[0].id
  },
  {
    ...filler,
    id: '8eaab2f4-9279-4ae9-8f1a-da3f92b4f23a',
    organizationId: organizations[1].id,
    organization: organizations[1],
    traineeId: trainees[1].id
  },
  {
    ...filler,
    id: '3591d46c-dde5-4b9a-a187-5970938ad7c8',
    organizationId: organizations[1].id,
    organization: organizations[1],
    traineeId: trainees[2].id
  },
  {
    ...filler,
    id: '17f43d7a-4525-4f23-bf74-b20b414eea07',
    organizationId: organizations[1].id,
    organization: organizations[1],
    traineeId: trainees[3].id
  },
  {
    ...filler,
    id: '17b94ad7-bea4-4e2d-adcb-261d0ee98c83',
    organizationId: organizations[1].id,
    organization: organizations[1],
    traineeId: trainees[4].id
  },
  {
    ...filler,
    id: '754dcd8d-550a-4adb-baa6-a117efc72477',
    organizationId: organizations[2].id,
    organization: organizations[2],
    traineeId: trainees[0].id
  },
  {
    ...filler,
    id: '252c0c77-4d9b-4147-bf36-4528e7f413aa',
    organizationId: organizations[2].id,
    organization: organizations[2],
    traineeId: trainees[1].id
  },
  {
    ...filler,
    id: '70670971-1e63-4139-9842-6f8e706ddb1a',
    organizationId: organizations[2].id,
    organization: organizations[2],
    traineeId: trainees[2].id
  },
  {
    ...filler,
    id: '7fd0a3f9-b8ba-4687-bde9-6b96d023521c',
    organizationId: organizations[2].id,
    organization: organizations[2],
    traineeId: trainees[3].id
  },
  {
    ...filler,
    id: '07ea4af4-19a9-4eda-82d9-115a091316b5',
    organizationId: organizations[2].id,
    organization: organizations[2],
    traineeId: trainees[4].id
  },
  {
    ...filler,
    id: '4ea684c6-c51f-44aa-8a7a-7219c48aaf99',
    organizationId: organizations[3].id,
    organization: organizations[3],
    traineeId: trainees[0].id
  },
  {
    ...filler,
    id: '3ed67c1e-912d-4fa3-9ac8-b14483d95ea2',
    organizationId: organizations[3].id,
    organization: organizations[3],
    traineeId: trainees[1].id
  },
  {
    ...filler,
    id: '848fbd3d-6792-4588-9187-025608c6ccc3',
    organizationId: organizations[3].id,
    organization: organizations[3],
    traineeId: trainees[2].id
  },
  {
    ...filler,
    id: 'e34713e2-ec31-4911-894a-d731e52f3768',
    organizationId: organizations[3].id,
    organization: organizations[3],
    traineeId: trainees[3].id
  },
  {
    ...filler,
    id: 'ddb8c89c-919a-49c8-9a30-bffa00feedf9',
    organizationId: organizations[3].id,
    organization: organizations[3],
    traineeId: trainees[4].id
  },
  {
    ...filler,
    id: '70908766-a18c-4ead-b1c2-643ebd09c3dd',
    organizationId: organizations[4].id,
    organization: organizations[4],
    traineeId: trainees[0].id
  },
  {
    ...filler,
    id: '35d70f29-50f3-4f4f-a4e8-d496f4aedee8',
    organizationId: organizations[4].id,
    organization: organizations[4],
    traineeId: trainees[1].id
  },
  {
    ...filler,
    id: 'c595b80d-b119-4dc6-bb15-ece6ce627125',
    organizationId: organizations[4].id,
    organization: organizations[4],
    traineeId: trainees[2].id
  },
  {
    ...filler,
    id: 'ef8efe5e-602b-4d0d-8995-fcaca8e1e9c2',
    organizationId: organizations[4].id,
    organization: organizations[4],
    traineeId: trainees[3].id
  },
  {
    ...filler,
    id: 'ec22ae27-6fd4-4978-9cf9-cbaaad8cec83',
    organizationId: organizations[4].id,
    organization: organizations[4],
    traineeId: trainees[4].id
  }
];
