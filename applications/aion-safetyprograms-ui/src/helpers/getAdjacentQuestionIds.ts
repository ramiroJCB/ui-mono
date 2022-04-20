import { DeepReadonly } from 'utility-types';
import { IAnswer } from 'interfaces/answer';
import { INestedQuestion } from 'interfaces/question';
import { requiresParentAnswer } from './requiresParentAnswer';

const annotateQuestionIds = (
  questions: DeepReadonly<INestedQuestion[]>,
  questionAnswers: DeepReadonly<IAnswer[]>,
  shouldBeEnabled: (question: DeepReadonly<INestedQuestion>, questionAnswers: DeepReadonly<IAnswer[]>) => boolean
): { id: string; enabled: boolean }[] =>
  questions.reduce(
    (a, question) => [
      ...a,
      {
        id: question.id,
        enabled: shouldBeEnabled(question, questionAnswers)
      },
      ...annotateQuestionIds(question.questions, questionAnswers, shouldBeEnabled)
    ],
    []
  );

const getAdjacentQuestionIds = (
  questions: DeepReadonly<INestedQuestion[]>,
  questionAnswers: DeepReadonly<IAnswer[]>,
  questionId: string,
  shouldBeEnabled: (question: DeepReadonly<INestedQuestion>, questionAnswers: DeepReadonly<IAnswer[]>) => boolean
): { prevQuestionId?: string; nextQuestionId?: string } => {
  const annotatedQuestionIds = annotateQuestionIds(questions, questionAnswers, shouldBeEnabled);
  const index = annotatedQuestionIds.findIndex(({ id }) => id === questionId);

  return index > -1
    ? {
        prevQuestionId: annotatedQuestionIds
          .slice(0, index)
          .reverse()
          .find(({ enabled }) => enabled)?.id,
        nextQuestionId: annotatedQuestionIds.slice(index + 1).find(({ enabled }) => enabled)?.id
      }
    : {};
};

export const getAdjacentContractorQuestionIds = (
  questions: DeepReadonly<INestedQuestion[]>,
  questionAnswers: DeepReadonly<IAnswer[]>,
  questionId: string
) =>
  getAdjacentQuestionIds(
    questions,
    questionAnswers,
    questionId,
    (question, questionAnswers) => !requiresParentAnswer(question.parentQuestionId, questionAnswers)
  );

export const getAdjacentEvaluatorQuestionIds = (
  questions: DeepReadonly<INestedQuestion[]>,
  questionAnswers: DeepReadonly<IAnswer[]>,
  questionId: string
) =>
  getAdjacentQuestionIds(
    questions,
    questionAnswers,
    questionId,
    (question, questionAnswers) => questionAnswers.find(({ questionId }) => questionId === question.id) !== undefined
  );
