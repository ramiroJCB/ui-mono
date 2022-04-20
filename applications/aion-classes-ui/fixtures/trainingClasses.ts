import * as faker from 'faker';
import {
  ITrainingClass,
  TrainingClassLanguage,
  TrainingClassStatus,
  TrainingClassType
} from '../../../packages/aion-ui-core/src/interfaces/trainingClass';
import { secondaryInstructors, trainingProviders } from '../../../packages/aion-ui-core/src/fixtures';

const { English, French, Spanish, Vietnamese } = TrainingClassLanguage;
const { Incomplete, Submitted, ActionNeeded } = TrainingClassStatus;
const { Manual, PecCbt } = TrainingClassType;

export const trainingClasses: ITrainingClass[] = [
  {
    id: 'd25372dd-8e5e-489f-837f-744b6b9a76b9',
    program: {
      id: 'ea765b2d-2a1f-4f49-ae3a-46b724c49b77',
      name: 'PEC Basic Safety 101'
    },
    location: {
      streetAddress: '7334 W. Alameda Blvd',
      city: 'Houma',
      state: 'LA',
      zip: '70152',
      description: ''
    },
    cardRecipient: {
      companyName: 'Johnny Drill Co',
      attn: null,
      streetAddress1: '34 West Ave',
      streetAddress2: null,
      city: 'Baton Rouge',
      state: 'LA',
      zip: '71272'
    },
    hours: 6.0,
    startDate: faker.date.future().toUTCString(),
    endDate: '2020-12-10',
    timeZoneId: 'America/Chicago',
    supportedLanguages: [English, Spanish],
    translator: 'Bobby Bouche',
    status: Incomplete,
    primaryInstructor: {
      userId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
      firstName: 'Jack',
      lastName: 'Rhysider',
      officePhoneNumber: '504-837-7227',
      emailAddress: 'mrtrainer5@gmail.com'
    },
    secondaryInstructor: null,
    trainingProvider: null,
    classType: Manual,
    acceptsReservations: true,
    studentCapacity: 6,
    pricePerStudent: '95.00',
    primaryInstructorUserId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
    programId: 'ea765b2d-2a1f-4f49-ae3a-46b724c49b77',
    trainingProviderId: '',
    meta: {
      totalActiveReservations: 3,
      totalActiveSeatsReserved: 16,
      totalReservations: 4,
      totalStudents: 6
    }
  },
  {
    id: '8014403b-a714-44b7-8e8d-6d5bc5b1884a',
    program: {
      id: '93774786-db6f-404e-a891-d2e1b0400fe8',
      name: 'Fire Safety (Awareness)'
    },
    location: {
      streetAddress: '7334 W. Alameda Blvd',
      city: 'Houma',
      state: 'LA',
      zip: '70152',
      description: ''
    },
    cardRecipient: {
      companyName: 'A-Plus Pipelines',
      attn: 'Al Lugman',
      streetAddress1: 'PO Box 3291',
      streetAddress2: 'Attn: Al',
      city: 'Gretna',
      state: 'LA',
      zip: '70056'
    },
    hours: 3.5,
    startDate: faker.date.future().toUTCString(),
    endDate: '2020-06-04',
    timeZoneId: 'America/Chicago',
    supportedLanguages: [English],
    translator: null,
    status: ActionNeeded,
    primaryInstructor: {
      userId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
      firstName: 'Jack',
      lastName: 'Rhysider',
      officePhoneNumber: '504-837-7227',
      emailAddress: 'mrtrainer5@gmail.com'
    },
    secondaryInstructor: secondaryInstructors[3],
    trainingProvider: trainingProviders[0],
    classType: Manual,
    acceptsReservations: true,
    studentCapacity: 25,
    pricePerStudent: '75.95',
    primaryInstructorUserId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
    programId: '93774786-db6f-404e-a891-d2e1b0400fe8',
    trainingProviderId: trainingProviders[0].id,
    meta: {
      totalActiveReservations: 3,
      totalActiveSeatsReserved: 17,
      totalReservations: 4,
      totalStudents: 20
    }
  },
  {
    id: '295ce56f-5439-436f-9ee8-6b3cfa7c1ac3',
    program: {
      id: '0288c852-2955-4f5d-9aec-4b616bb22492',
      name: 'PEC Advanced Safety 102'
    },
    location: {
      streetAddress: '7334 W. Alameda Blvd',
      city: 'Houma',
      state: 'LA',
      zip: '70152',
      description: ''
    },
    cardRecipient: {
      companyName: 'ACME Drill Widgets, Inc.',
      attn: 'Howard I. Neau',
      streetAddress1: '321 Anywhere Lane',
      streetAddress2: null,
      city: 'Ruston',
      state: 'LA',
      zip: '71272'
    },
    hours: 2.0,
    startDate: faker.date.future().toUTCString(),
    endDate: '2020-06-23',
    timeZoneId: 'America/Chicago',
    supportedLanguages: [English, Vietnamese],
    translator: 'Hank Bigshot',
    status: Submitted,
    primaryInstructor: {
      userId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
      firstName: 'Jack',
      lastName: 'Rhysider',
      officePhoneNumber: '504-837-7227',
      emailAddress: 'mrtrainer5@gmail.com'
    },
    secondaryInstructor: secondaryInstructors[5],
    trainingProvider: trainingProviders[1],
    classType: Manual,
    acceptsReservations: true,
    studentCapacity: 25,
    pricePerStudent: '135.50',
    primaryInstructorUserId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
    programId: '0288c852-2955-4f5d-9aec-4b616bb22492',
    trainingProviderId: trainingProviders[1].id,
    meta: {
      totalActiveReservations: 0,
      totalActiveSeatsReserved: 0,
      totalReservations: 0,
      totalStudents: 8
    }
  },
  {
    id: 'aa149beb-3fe3-48d0-b89d-2124eaa5986b',
    program: {
      id: '0288c852-2955-4f5d-9aec-4b616bb22492',
      name: 'PEC Advanced Safety 102'
    },
    location: {
      streetAddress: '7334 W. Alameda Blvd',
      city: 'New Orleans',
      state: 'LA',
      zip: '70152',
      description: ''
    },
    cardRecipient: {
      companyName: 'Wayne Widgets, Inc.',
      attn: 'Howard I. Neau',
      streetAddress1: '1143B Roosevelt Blvd.',
      streetAddress2: null,
      city: 'New Orleans',
      state: 'LA',
      zip: '70121'
    },
    hours: 3.5,
    startDate: faker.date.future().toUTCString(),
    endDate: '2020-09-23',
    timeZoneId: 'America/Chicago',
    supportedLanguages: [English, French],
    translator: 'Juan Gonzalez',
    status: Incomplete,
    primaryInstructor: {
      userId: '161e9c44-5088-40be-8f48-f5a286153bcb',
      firstName: 'Ed',
      lastName: 'Kemper',
      officePhoneNumber: '504-837-7227',
      emailAddress: 'mrtrainer5@gmail.com'
    },
    secondaryInstructor: secondaryInstructors[0],
    trainingProvider: trainingProviders[1],
    classType: Manual,
    acceptsReservations: true,
    studentCapacity: null,
    pricePerStudent: '175.00',
    primaryInstructorUserId: '161e9c44-5088-40be-8f48-f5a286153bcb',
    programId: '0288c852-2955-4f5d-9aec-4b616bb22492',
    trainingProviderId: trainingProviders[1].id,
    meta: {
      totalActiveReservations: 0,
      totalActiveSeatsReserved: 0,
      totalReservations: 0,
      totalStudents: 9
    }
  },
  {
    id: '7dbeb6b6-b78c-4c9d-a097-b8efe9d5f586',
    program: {
      id: '0288c852-2955-4f5d-9aec-4b616bb22492',
      name: 'PEC Advanced Safety 102'
    },
    location: {
      streetAddress: null,
      city: 'Gulfport',
      state: 'MS',
      zip: '39501',
      description: null
    },
    cardRecipient: {
      companyName: 'Marge Pipes & Drill Bitz',
      attn: 'Marge Grande',
      streetAddress1: '817 Pass Rd',
      streetAddress2: null,
      city: 'Gulfport',
      state: 'MS',
      zip: '39501'
    },
    hours: 6.5,
    startDate: faker.date.future().toUTCString(),
    endDate: '2020-11-29',
    timeZoneId: 'America/Chicago',
    supportedLanguages: [English],
    translator: null,
    status: Incomplete,
    primaryInstructor: {
      userId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
      firstName: 'Jack',
      lastName: 'Rhysider',
      officePhoneNumber: '504-837-7227',
      emailAddress: 'mrtrainer5@gmail.com'
    },
    secondaryInstructor: secondaryInstructors[1],
    trainingProvider: trainingProviders[1],
    classType: PecCbt,
    acceptsReservations: true,
    studentCapacity: 0,
    pricePerStudent: '240.63',
    primaryInstructorUserId: '4a69ccc6-48b1-4550-b5dd-d518ee17c1f3',
    programId: '0288c852-2955-4f5d-9aec-4b616bb22492',
    trainingProviderId: trainingProviders[1].id,
    meta: {
      totalActiveReservations: 0,
      totalActiveSeatsReserved: 0,
      totalReservations: 0,
      totalStudents: 0
    }
  }
];
