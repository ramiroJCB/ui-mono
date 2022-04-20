import * as faker from 'faker';
import { IComment } from '../src/interfaces/comment';
import { safetyProgramQuestionAnswers } from './safetyProgramQuestionAnswers';
import { userInfo } from '../../../packages/aion-ui-core/src/fixtures';

export const safetyProgramComments: IComment[] = Array(10)
  .fill({})
  .map(() => ({
    comments: faker.lorem.paragraph(),
    contractorId: '0b7319a1-4571-4940-aabd-5b4d42bc086f',
    createdBy: faker.random.arrayElement([faker.internet.userName(), userInfo.userName]),
    createdDateUtc: faker.date.past().toISOString(),
    id: faker.random.uuid(),
    isEvaluatorComment: faker.random.boolean(),
    isRead: faker.random.boolean(),
    questionAnswerId: safetyProgramQuestionAnswers[0].id
  }));
