import * as faker from 'faker';
import { IReference } from '../src/interfaces/reference';
import { safetyProgramDocumentMetadata } from './safetyProgramDocumentMetadata';
import { safetyProgramQuestionAnswers } from './safetyProgramQuestionAnswers';

export const safetyProgramDocumentReferences: IReference[] = Array(5)
  .fill({})
  .map(() => {
    const documentMetadata = faker.random.arrayElement(safetyProgramDocumentMetadata);

    return {
      id: faker.random.uuid(),
      questionAnswerId: safetyProgramQuestionAnswers[0].id,
      pageNumber: faker.random.number(95),
      selectionLocation: {
        x: faker.random.number(50),
        y: faker.random.number(50),
        width: faker.random.number(50),
        height: faker.random.number(50),
        unit: '%'
      },
      createdDateUtc: faker.date.past().toISOString(),
      documentMetadataId: documentMetadata.id,
      documentMetadata
    };
  });
