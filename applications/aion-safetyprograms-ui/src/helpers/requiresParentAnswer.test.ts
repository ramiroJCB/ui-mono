import { AnswerStatus } from 'interfaces/answer';
import { requiresParentAnswer } from './requiresParentAnswer';

const parentQuestionId = '565c64e5-e3f3-41c8-a0be-e69b1d4f3a17';

const filler = {
  hasUnreadEvaluatorComments: false,
  hasUnreadContractorComments: false,
  id: '',
  organizationId: '',
  questionId: parentQuestionId,
  safetyProgramRequirementId: '',
  status: AnswerStatus.Incomplete
};

it('returns false for a top-level question', () => {
  expect(requiresParentAnswer(null, [])).toBe(false);
});

it('returns false for a question whose parent has a "yes" answer', () => {
  expect(
    requiresParentAnswer(parentQuestionId, [
      {
        ...filler,
        answerValue: true
      }
    ])
  ).toBe(false);
});

it('returns true for a question whose parent has a "no" answer', () => {
  expect(
    requiresParentAnswer(parentQuestionId, [
      {
        ...filler,
        answerValue: false
      }
    ])
  ).toBe(true);
});

it("returns true for a question whose parent hasn't been answered", () => {
  expect(requiresParentAnswer(parentQuestionId, [])).toBe(true);
});
