import { moveQuestion, resolveSortOrder } from './questionOrder';

const filler = {
  title: '',
  safetyProgramId: '',
  parentQuestionId: '',
  body: '',
  updatedBy: '',
  updatedDateUtc: ''
};

const questions = [
  {
    id: '0',
    sortOrder: 1,
    ...filler
  },
  {
    id: '1',
    sortOrder: 2,
    ...filler
  },
  {
    id: '2',
    sortOrder: 3,
    ...filler
  },
  {
    id: '3',
    sortOrder: 5,
    ...filler
  },
  {
    id: '4',
    sortOrder: 8,
    ...filler
  }
];

describe('moveQuestion', () => {
  it.each([
    [3, 0, ['3', '0', '1', '2', '4']],
    [1, 2, ['0', '2', '1', '3', '4']],
    [3, 3, ['0', '1', '2', '3', '4']],
    [4, 2, ['0', '1', '4', '2', '3']],
    [2, 4, ['0', '1', '3', '4', '2']]
  ])(
    'moves a question from source index %d to destination index %d',
    (sourceIndex: number, destinationIndex: number, ids: string[]) => {
      expect(moveQuestion(questions, sourceIndex, destinationIndex).map(({ id }) => id)).toEqual(ids);
    }
  );
});

describe('resolveSortOrder', () => {
  it.each([
    [1, 2, 5],
    [1, 3, 8],
    [4, 1, 2],
    [2, 4, 9],
    [4, 0, 1]
  ])(
    'resolves the new sortOrder for an item moving from source index %d to destination index %d',
    (sourceIndex: number, destinationIndex: number, sortOrder: number) => {
      expect(resolveSortOrder(questions, sourceIndex, destinationIndex)).toBe(sortOrder);
    }
  );
});
