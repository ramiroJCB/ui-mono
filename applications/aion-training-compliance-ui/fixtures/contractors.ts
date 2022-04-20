import * as faker from 'faker';
import { IContractor } from '../src/interfaces/contractor';

export const contractors: IContractor[] = [];

for (let i = 0; i < 1000; i += 1) {
  contractors.push({
    id: faker.random.uuid(),
    clientId: faker.random.uuid(),
    name: faker.company.companyName(),
    organizationId: faker.random.uuid(),
    description: faker.company.catchPhraseDescriptor(),
    compliantEmployeesCount: faker.random.number(),
    totalEmployeesCount: faker.random.number(),
    compliantEmployeesPercentage: faker.random.number(),
    employeeCountUpdatedDateUtc: faker.date.past().toISOString(),
    isDeleted: false,
    contactName: faker.name.findName(),
    contactJobTitle: faker.name.jobTitle(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    contactPhoneNumber: faker.phone.phoneNumber(),
    contactMobileNumber: faker.phone.phoneNumber(),
    contactEmail: faker.internet.email()
  });
}
