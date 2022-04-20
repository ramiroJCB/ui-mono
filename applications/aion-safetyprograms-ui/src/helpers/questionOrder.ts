import { DeepReadonly } from 'ts-essentials';
import { IQuestion } from 'interfaces/question';

export const moveQuestion = <T>(questions: DeepReadonly<T[]>, sourceIndex: number, destinationIndex: number) => {
  const clone = [...questions];
  const [removed] = clone.splice(sourceIndex, 1);

  clone.splice(destinationIndex, 0, removed);
  return clone;
};

export const resolveSortOrder = (
  questions: DeepReadonly<IQuestion[]>,
  sourceIndex: number,
  destinationIndex: number
) => {
  const isReplacingLastQuestion = destinationIndex === questions.length - 1;
  const lastQuestion = questions[questions.length - 1];
  const isMovingDown = destinationIndex > sourceIndex;

  let sortOrder;

  if (isReplacingLastQuestion) {
    sortOrder = lastQuestion.sortOrder + 1;
  } else if (isMovingDown) {
    // When an item is moved down, the removal of its original index reduces all
    // destination indexes by 1, when compared to the matching question index. Whee!
    sortOrder = questions[destinationIndex + 1].sortOrder;
  } else {
    sortOrder = questions[destinationIndex].sortOrder;
  }

  return sortOrder;
};
