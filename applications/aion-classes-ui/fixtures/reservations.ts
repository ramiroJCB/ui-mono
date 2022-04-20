import {
  IReservation,
  IReservationContact,
  IReservationsUser,
  ReservationSource,
  ReservationStatus
} from '../../../packages/aion-ui-core/src/interfaces/reservation';
import { trainingClasses } from './trainingClasses';

const { InsideSales } = ReservationSource;
const { Active, Cancelled } = ReservationStatus;

const organizations: { organizationId: string; organizationName: string }[] = [
  {
    organizationId: '417643c8-41b7-41a9-be01-39a9db6e4fdd',
    organizationName: 'California Resources Corporation'
  },
  {
    organizationId: 'c36f5952-856f-40c7-b533-88ef0d9045c6',
    organizationName: 'Betsy Drills & Widgets, LLC'
  },
  {
    organizationId: 'c2c7cf61-636f-4c90-9756-9287991d7cf2',
    organizationName: 'Green Reserve Drilling Co.'
  },
  {
    organizationId: '44d82946-08fd-4462-bafa-45ae7ec8c40e',
    organizationName: 'Jacob Wells Co.'
  }
];

const contacts: IReservationContact[] = [
  {
    firstName: 'Jill',
    lastName: 'Morin',
    phoneNumber: '504-816-1279',
    emailAddress: 'jill.morin@crc.info'
  },
  {
    firstName: 'Curtis',
    lastName: 'Brown',
    phoneNumber: '810-356-9811',
    emailAddress: 'mrcurtis@yahoo.biz'
  },
  {
    firstName: 'John',
    lastName: 'Hammersmith',
    phoneNumber: '985-466-0901',
    emailAddress: 'jhammersmith@grdrilling.net'
  },
  {
    firstName: 'Claude',
    lastName: 'Smith',
    phoneNumber: '800-950-0888 EXT 124',
    emailAddress: 'claude@jacobwells.co'
  }
];

const users: IReservationsUser[] = [
  {
    userId: '433579ed-85b0-447f-8d75-36ab7395e9bd',
    userName: 'johnny.archie@jazzigals.info',
    fullName: 'Johnny Archibald, Jr.'
  },
  {
    userId: '0f4b6e96-2969-46df-8392-badb7b53dd7d',
    userName: 'takinshortiestoschool@stpss.gov',
    fullName: 'Lewis Melton'
  },
  {
    userId: '7e5af110-d3ea-40a3-bbd9-e54c13e3393e',
    userName: 'mingogetspa1d@gmail.com',
    fullName: 'Barkevious Mingo'
  },
  {
    userId: '3228fb51-7ad8-42a8-8b1a-85b785b3a800',
    userName: 's.mcintyre@msn.com',
    fullName: 'SaraBeth McIntyre'
  },
  {
    userId: 'a9de2756-2d98-4d09-948f-74a93a90f322',
    userName: 'creice',
    fullName: 'Christian Reice-Hemmington'
  }
];

export const reservations: IReservation[] = [
  {
    id: 'e2207670-3fde-4492-ac99-e9b434949ebe',
    createdDateUtc: '2020-04-01T02:06:20Z',
    updatedDateUtc: '2020-04-12T09:00:00Z',
    createdBy: users[0],
    updatedBy: users[3],
    classId: trainingClasses[0].id,
    contact: contacts[0],
    organizationId: organizations[0].organizationId,
    organizationName: organizations[0].organizationName,
    reservedSeatsCount: 6,
    comment: null,
    source: InsideSales,
    status: Active
  },
  {
    id: '4c244319-d22c-4212-8a8d-b54c9c5e1f52',
    createdDateUtc: '2020-05-02T02:06:20Z',
    updatedDateUtc: null,
    createdBy: users[1],
    updatedBy: null,
    classId: trainingClasses[0].id,
    contact: contacts[1],
    organizationId: organizations[1].organizationId,
    organizationName: organizations[1].organizationName,
    reservedSeatsCount: 2,
    comment: 'Contact said workers got sick so will have to postpone',
    source: InsideSales,
    status: Cancelled
  },
  {
    id: '70c7523c-7a1b-4e8f-b21c-c4f967f2c21c',
    createdDateUtc: '2020-05-04T11:23:10Z',
    updatedDateUtc: '2020-05-04T12:12:05Z',
    createdBy: users[4],
    updatedBy: users[2],
    classId: trainingClasses[0].id,
    contact: contacts[2],
    organizationId: organizations[2].organizationId,
    organizationName: organizations[2].organizationName,
    reservedSeatsCount: 4,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    source: InsideSales,
    status: Active
  },
  {
    id: '837bf08f-e816-4ad4-9900-19f6108ceea6',
    createdDateUtc: '2020-05-05T13:16:23Z',
    updatedDateUtc: null,
    createdBy: users[3],
    updatedBy: null,
    classId: trainingClasses[0].id,
    contact: contacts[3],
    organizationId: organizations[3].organizationId,
    organizationName: organizations[3].organizationName,
    reservedSeatsCount: 6,
    comment: null,
    source: InsideSales,
    status: Active
  },
  {
    id: 'c02073e8-345e-42b9-8af4-ced94901909e',
    createdDateUtc: '2020-04-01T02:06:20Z',
    updatedDateUtc: null,
    createdBy: users[4],
    updatedBy: null,
    classId: trainingClasses[1].id,
    contact: contacts[0],
    organizationId: organizations[0].organizationId,
    organizationName: organizations[0].organizationName,
    reservedSeatsCount: 3,
    comment: 'contact estimated 3 students per week will eed training from now through the end of 2020.',
    source: InsideSales,
    status: Active
  },
  {
    id: '4c244319-d22c-4212-8a8d-b54c9c5e1f52',
    createdDateUtc: '2020-05-02T02:06:20Z',
    updatedDateUtc: null,
    createdBy: users[3],
    updatedBy: null,
    classId: trainingClasses[1].id,
    contact: contacts[1],
    organizationId: organizations[1].organizationId,
    organizationName: organizations[1].organizationName,
    reservedSeatsCount: 2,
    comment: 'Contact said workers got sick so will have to postpone',
    source: InsideSales,
    status: Cancelled
  },
  {
    id: '70c7523c-7a1b-4e8f-b21c-c4f967f2c21c',
    createdDateUtc: '2020-05-04T11:23:10Z',
    updatedDateUtc: '2020-05-04T12:12:05Z',
    createdBy: users[2],
    updatedBy: users[0],
    classId: trainingClasses[1].id,
    contact: contacts[2],
    organizationId: organizations[2].organizationId,
    organizationName: organizations[2].organizationName,
    reservedSeatsCount: 4,
    comment: 'may need another seat but said he would call ahead if so',
    source: InsideSales,
    status: Active
  },
  {
    id: '837bf08f-e816-4ad4-9900-19f6108ceea6',
    createdDateUtc: '2020-05-05T13:16:23Z',
    updatedDateUtc: null,
    createdBy: users[1],
    updatedBy: null,
    classId: trainingClasses[1].id,
    contact: contacts[3],
    organizationId: organizations[3].organizationId,
    organizationName: organizations[3].organizationName,
    reservedSeatsCount: 10,
    comment: null,
    source: InsideSales,
    status: Active
  }
];
