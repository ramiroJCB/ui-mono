import * as faker from 'faker';
import { IContractorRequirement } from '../src/interfaces/requirement';
import { IExpandedQuestion } from '../src/interfaces/question';
import { randomRequirementStatus } from './helpers';
import { safetyProgramQuestionAnswers } from './safetyProgramQuestionAnswers';
import { safetyProgramRequirements } from './safetyProgramRequirements';
import { safetyPrograms } from './safetyPrograms';

const augment = (question: IExpandedQuestion) => ({
  ...question,
  hasUnreadEvaluatorComments: faker.random.boolean(),
  hasUnreadContractorComments: faker.random.boolean(),
  questions: question.questions.map(augment),
  status: randomRequirementStatus()
});

const { questions, ...safetyProgram } = safetyPrograms[0];

export const contractorRequirements: IContractorRequirement[] = safetyProgramRequirements.map(
  ({ clients, ...safetyProgramRequirement }) => ({
    ...safetyProgramRequirement,
    safetyProgram: {
      ...safetyProgram,
      id: safetyProgramRequirement.safetyProgramId,
      title: safetyProgramRequirement.safetyProgramTitle
    },
    questions: questions.map(augment),
    questionAnswers: safetyProgramQuestionAnswers
  })
);
