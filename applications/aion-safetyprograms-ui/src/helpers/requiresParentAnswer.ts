import { DeepReadonly } from 'ts-essentials';
import { IAnswer } from 'interfaces/answer';
import { IQuestion } from 'interfaces/question';

export const requiresParentAnswer = (
  parentQuestionId: IQuestion['parentQuestionId'],
  answers: DeepReadonly<IAnswer[]>
) =>
  parentQuestionId !== null && answers.find(({ questionId }) => questionId === parentQuestionId)?.answerValue !== true;
