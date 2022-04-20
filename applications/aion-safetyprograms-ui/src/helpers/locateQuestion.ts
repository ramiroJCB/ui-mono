import { DeepReadonly } from 'utility-types';
import { INestedQuestion } from 'interfaces/question';

export const locateQuestion = (
  questions: DeepReadonly<INestedQuestion[]>,
  questionId: string
): DeepReadonly<INestedQuestion> | undefined =>
  questions.reduce(
    (match, question) =>
      match || (question.id === questionId ? question : locateQuestion(question.questions, questionId)),
    undefined
  );
