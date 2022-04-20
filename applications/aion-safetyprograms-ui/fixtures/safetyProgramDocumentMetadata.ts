import * as faker from 'faker';
import { IDocument } from '../src/interfaces/document';
import { safetyProgramContractors } from './safetyProgramContractors';

export const safetyProgramDocumentMetadata: IDocument[] = Array(100)
  .fill({})
  .map(() => {
    const organization = faker.random.arrayElement(safetyProgramContractors);

    return {
      id: faker.random.uuid(),
      organizationId: organization.id,
      organizationCompanyNumber: faker.random.arrayElement([null, faker.random.number(99999)]),
      organizationName: organization.name,
      mimeType: 'application/pdf',
      fileName: faker.system.commonFileName('pdf'),
      fileSize: faker.random.number(15e6),
      createdDateUtc: faker.date.past().toISOString()
    };
  });
