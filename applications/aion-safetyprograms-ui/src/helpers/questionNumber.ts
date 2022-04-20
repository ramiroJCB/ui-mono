import { DeepReadonly } from 'utility-types';
import { INestedQuestion, IQuestion } from 'interfaces/question';

interface IMappedQuestion extends IQuestion {
  index: number;
  length: number;
}

type QuestionsMap = {
  [id: string]: IMappedQuestion | undefined;
};

const mapQuestions = (questions: DeepReadonly<INestedQuestion[]>): QuestionsMap =>
  questions.reduce(
    (a, { questions: subQuestions, ...question }, index) => ({
      ...a,
      [question.id]: {
        ...question,
        index,
        length: subQuestions.length
      },
      ...mapQuestions(subQuestions)
    }),
    {}
  );

const resolveMappedQuestionNumber = (questionsMap: QuestionsMap, questionId: string) => {
  const ascendingQuestionNumbers = [];

  for (
    let question = questionsMap[questionId];
    question !== undefined;
    question = questionsMap[question.parentQuestionId || -1]
  ) {
    ascendingQuestionNumbers.push(question.index + 1);
  }

  return ascendingQuestionNumbers.reverse().join('.');
};

export const resolveNextQuestionNumber = (
  topLevelQuestions: DeepReadonly<INestedQuestion[]>,
  parentQuestionId: string | null
): string => {
  if (parentQuestionId) {
    const questionsMap = mapQuestions(topLevelQuestions);
    const prefix = resolveMappedQuestionNumber(questionsMap, parentQuestionId);
    const parentLength = questionsMap[parentQuestionId]?.length || 0;

    return `${prefix}.${parentLength + 1}`;
  } else {
    return (topLevelQuestions.length + 1).toString();
  }
};

export const resolveQuestionNumber = (
  topLevelQuestions: DeepReadonly<INestedQuestion[]>,
  questionId: string
): string => {
  const questionsMap = mapQuestions(topLevelQuestions);

  return resolveMappedQuestionNumber(questionsMap, questionId);
};
