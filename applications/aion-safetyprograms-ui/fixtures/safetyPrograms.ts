import * as faker from 'faker';
import { IExpandedSafetyProgram, SafetyProgramStatus } from '../src/interfaces/safetyProgram';
import { safetyProgramQuestions } from './safetyProgramQuestions';

const { Valid, Invalid } = SafetyProgramStatus;

export const safetyPrograms: IExpandedSafetyProgram[] = Array(100)
  .fill({})
  .map((_, i) => ({
    id: i > 0 ? faker.random.uuid() : '102ad2d2-3da7-4251-a3df-f9d300018b80',
    title: `${faker.random.words()} Program`,
    status: faker.random.arrayElement([Valid, Invalid]),
    questionCount: faker.random.number({ min: 5, max: 10 }),
    updatedBy: faker.name.lastName(),
    updatedDateUtc: faker.date.past().toISOString(),
    questions: [safetyProgramQuestions[0]]
  }));
