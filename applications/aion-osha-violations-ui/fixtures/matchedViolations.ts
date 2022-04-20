import * as faker from 'faker';
import { IMatchedViolations, CurrentStatus } from '../src/interfaces/matchedViolations';
import { IViolationsType } from '../src/interfaces/unMatchedViolations';

export const matchedViolations: IMatchedViolations[] = [];

const { Serious, Willful, Repeat, Other } = IViolationsType;
const { Associated, Unassociated, Pending } = CurrentStatus;

for (let i = 0; i < 30; i++)
  matchedViolations.push({
    id: faker.random.uuid(),
    oshaViolationId: {
      id: faker.random.uuid(),
      importedDateUtc: '2020-09-04T00:00:00Z',
      oshaCompanyName: faker.random.word(),
      citationId: '123123',
      activityNumber: faker.random.number(),
      violationType: faker.random.arrayElement([Serious, Willful, Repeat, Other]),
      openedDate: '2020-09-04T00:00:00Z',
      closedDate: '2020-09-04T00:00:00Z',
      naicsCodeId: {
        id: faker.random.uuid(),
        code: faker.random.alphaNumeric(),
        title: faker.name.title(),
        createdBy: faker.name.findName(),
        updatedBy: faker.name.findName(),
        createdDateUtc: '2020-09-04T00:00:00Z',
        updatedDateUtc: '2020-09-04T00:00:00Z'
      },
      state: faker.address.state(),
      createdBy: faker.random.alphaNumeric(),
      updatedBy: faker.random.alphaNumeric(),
      createdDateUtc: faker.random.alphaNumeric(),
      updatedDateUtc: faker.random.alphaNumeric()
    },
    createdBy: faker.random.alphaNumeric(),
    updatedBy: faker.random.alphaNumeric(),
    createdDateUtc: faker.random.alphaNumeric(),
    updatedDateUtc: faker.random.alphaNumeric(),
    matchPercentage: faker.random.number(),
    matchStatus: faker.random.arrayElement([Associated, Unassociated, Pending]),
    organizationId: {
      id: faker.random.uuid(),
      legacyId: faker.random.uuid(),
      name: faker.company.companyName(),
      primaryAddress: faker.address.state(),
      country: faker.address.country(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      createdBy: faker.name.findName(),
      updatedBy: faker.name.findName(),
      createdDateUtc: '2020-09-04T00:00:00Z',
      updatedDateUtc: '2020-09-04T00:00:00Z',
      naicsCodeId: faker.random.uuid()
    }
  });
