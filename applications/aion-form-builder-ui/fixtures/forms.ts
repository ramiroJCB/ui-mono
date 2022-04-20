import { IForm, FormStatus } from '../src/interfaces/form';
import * as faker from 'faker';

const { Draft, Published } = FormStatus;

export const forms: IForm[] = [
  {
    id: faker.random.uuid(),
    name: faker.random.word(),
    code: faker.lorem.slug(1),
    description: faker.lorem.sentence(),
    organizationId: faker.random.uuid(),
    organizationName: faker.company.companyName(),
    status: faker.random.arrayElement([Draft, Published]),
    createdDateUtc: faker.date.recent(180).toUTCString(),
    createdByUserId: faker.random.uuid(),
    createdByUserFirstName: faker.name.firstName(),
    createdByUserLastName: faker.name.lastName(),
    updatedDateUtc: null,
    updatedByUserId: null,
    updatedByUserFirstName: null,
    updatedByUserLastName: null,
    attachmentsMetadata: [],
    embeddedAttachmentsMetadata: [
      {
        id: faker.random.uuid(),
        fileName: faker.system.fileName(),
        mimeType: faker.system.mimeType(),
        url: faker.image.imageUrl()
      }
    ]
  }
];
