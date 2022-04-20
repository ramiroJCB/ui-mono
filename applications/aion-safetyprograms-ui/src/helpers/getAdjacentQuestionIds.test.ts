import { AnswerStatus } from 'interfaces/answer';
import { getAdjacentContractorQuestionIds, getAdjacentEvaluatorQuestionIds } from './getAdjacentQuestionIds';
import { topLevelQuestions } from './fixtures';

const filler = {
  id: '',
  organizationId: '',
  safetyProgramRequirementId: '',
  status: AnswerStatus.Incomplete,
  commentCount: 0,
  hasUnreadEvaluatorComments: false,
  hasUnreadContractorComments: false
};

const questionAnswers = [
  {
    ...filler,
    questionId: 'd8b00318-bb3c-4081-9497-fd209832ae46',
    answerValue: true
  },
  {
    ...filler,
    questionId: '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd',
    answerValue: false
  },
  {
    ...filler,
    questionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c',
    answerValue: false
  },
  {
    ...filler,
    questionId: '226a0af7-9704-4fcf-8d26-27f01a81f484',
    answerValue: true
  }
];

const question = {
  id: '16123818-2f58-4ca3-a33e-a9e486100eef',
  title: '',
  safetyProgramId: '',
  parentQuestionId: null,
  body: null,
  updatedBy: '',
  updatedDateUtc: '',
  sortOrder: 0,
  questions: []
};

describe('getAdjacentContractorQuestionIds', () => {
  it('disables and skips questions with parent questions that must be answered', () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd')
    ).toEqual({
      prevQuestionId: '08b0ba92-350a-4ad9-a71c-f1da9e57707f',
      nextQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c'
    });
  });

  it('links to nearest enabled questions, if viewing a disabled one', () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, '17766ddc-10fb-468b-949b-f21efc184283')
    ).toEqual({
      prevQuestionId: '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd',
      nextQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c'
    });
  });

  it('traverses the tree at different depths', () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, '226a0af7-9704-4fcf-8d26-27f01a81f484')
    ).toEqual({
      prevQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c',
      nextQuestionId: 'a6d35206-0e3e-443a-b869-1fd041a02aba'
    });
  });

  it('omits previous ID if the question is the first', () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, 'd8b00318-bb3c-4081-9497-fd209832ae46')
    ).toEqual({
      prevQuestionId: undefined,
      nextQuestionId: '08b0ba92-350a-4ad9-a71c-f1da9e57707f'
    });
  });

  it('omits next ID if the question is the last', () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, 'b2352dc0-25f5-4ba4-8fd1-fc360ef253c9')
    ).toEqual({
      prevQuestionId: '6f91c90f-e6e2-457a-8653-13e2bc32ecfa',
      nextQuestionId: undefined
    });
  });

  it("returns an empty object if the question can't be found", () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, '8e72a6bf-a92a-42bd-b73f-011326ce74f0')
    ).toEqual({});
  });

  it('returns an empty object if the question is an only child', () => {
    expect(getAdjacentContractorQuestionIds([question], [], '16123818-2f58-4ca3-a33e-a9e486100eef')).toEqual({});
  });
});

describe('getAdjacentEvaluatorQuestionIds', () => {
  it('disables and skips questions without answers', () => {
    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd')
    ).toEqual({
      prevQuestionId: 'd8b00318-bb3c-4081-9497-fd209832ae46',
      nextQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c'
    });
  });

  it('links to nearest enabled questions, if viewing a disabled one', () => {
    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, '17766ddc-10fb-468b-949b-f21efc184283')
    ).toEqual({
      prevQuestionId: '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd',
      nextQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c'
    });
  });

  it('traverses the tree at different depths', () => {
    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, '226a0af7-9704-4fcf-8d26-27f01a81f484')
    ).toEqual({
      prevQuestionId: 'ae164c19-778a-4ea6-9445-49285e4b4e3c',
      nextQuestionId: undefined
    });
  });

  it('omits previous ID if the question is the first', () => {
    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, 'd8b00318-bb3c-4081-9497-fd209832ae46')
    ).toEqual({
      prevQuestionId: undefined,
      nextQuestionId: '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd'
    });
  });

  it('omits next ID if the question is the last', () => {
    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, 'b2352dc0-25f5-4ba4-8fd1-fc360ef253c9')
    ).toEqual({
      prevQuestionId: '226a0af7-9704-4fcf-8d26-27f01a81f484',
      nextQuestionId: undefined
    });
  });

  it("returns an empty object if the question can't be found", () => {
    expect(
      getAdjacentContractorQuestionIds(topLevelQuestions, questionAnswers, '8e72a6bf-a92a-42bd-b73f-011326ce74f0')
    ).toEqual({});

    expect(
      getAdjacentEvaluatorQuestionIds(topLevelQuestions, questionAnswers, '8e72a6bf-a92a-42bd-b73f-011326ce74f0')
    ).toEqual({});
  });

  it('returns an empty object if the question is an only child', () => {
    expect(getAdjacentEvaluatorQuestionIds([question], [], '16123818-2f58-4ca3-a33e-a9e486100eef')).toEqual({});
  });
});
