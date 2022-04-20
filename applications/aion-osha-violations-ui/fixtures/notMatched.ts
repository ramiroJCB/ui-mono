import * as faker from 'faker';
import { IUnMatchedViolations } from '../src/interfaces/unMatchedViolations';
import { IViolationsType } from '../src/interfaces/unMatchedViolations';
export const notMatched: IUnMatchedViolations[] = [];

const { Serious, Willful, Repeat, Other } = IViolationsType;
for (let i = 0; i < 30; i++)
  notMatched.push({
    id: faker.random.uuid(),
    importedDateUtc: '2020-09-04T00:00:00Z',
    oshaCompanyName: faker.random.word(),
    citationId: '123123',
    activityNumber: faker.random.number(),
    violationType: faker.random.arrayElement([Serious, Willful, Repeat, Other]),
    openedDate: '2020-09-04T00:00:00Z',
    closedDate: '2020-09-04T00:00:00Z',
    naicsCode: faker.random.number(),
    state: faker.address.state(),
    createdBy: faker.random.alphaNumeric(),
    updatedBy: faker.random.alphaNumeric(),
    createdDateUtc: faker.random.alphaNumeric(),
    updatedDateUtc: faker.random.alphaNumeric()
  });
