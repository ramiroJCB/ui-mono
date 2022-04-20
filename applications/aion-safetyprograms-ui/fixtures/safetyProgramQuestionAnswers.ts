import * as faker from 'faker';
import { AnswerStatus, IAnswer } from '../src/interfaces/answer';
import { safetyProgramQuestions } from './safetyProgramQuestions';

const { Acceptable, AcceptableOrRejectable, Accepted, Completable, Incomplete, Rejected } = AnswerStatus;

export const safetyProgramQuestionAnswers: IAnswer[] = safetyProgramQuestions.map(({ id }) => ({
  id: faker.random.uuid(),
  questionId: id,
  organizationId: '0b7319a1-4571-4940-aabd-5b4d42bc086f',
  safetyProgramRequirementId: faker.random.uuid(),
  answerValue: faker.random.boolean(),
  status: faker.random.arrayElement([Acceptable, AcceptableOrRejectable, Accepted, Completable, Incomplete, Rejected]),
  commentCount: faker.random.number(5),
  hasUnreadEvaluatorComments: faker.random.boolean(),
  hasUnreadContractorComments: faker.random.boolean()
}));
