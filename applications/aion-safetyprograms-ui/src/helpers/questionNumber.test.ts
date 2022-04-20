import { resolveNextQuestionNumber, resolveQuestionNumber } from './questionNumber';
import { topLevelQuestions } from './fixtures';

describe('resolveQuestionNumber', () => {
  it.each([
    ['d8b00318-bb3c-4081-9497-fd209832ae46', '1'],
    ['08b0ba92-350a-4ad9-a71c-f1da9e57707f', '1.1'],
    ['6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd', '1.2'],
    ['1f657fbc-fc69-41d3-8616-25122492cff6', '1.2.1'],
    ['17766ddc-10fb-468b-949b-f21efc184283', '1.2.2'],
    ['92c0a0a9-edbc-44ab-84b5-e71e2f735a30', '1.2.3'],
    ['ae164c19-778a-4ea6-9445-49285e4b4e3c', '1.3'],
    ['226a0af7-9704-4fcf-8d26-27f01a81f484', '2'],
    ['a6d35206-0e3e-443a-b869-1fd041a02aba', '2.1'],
    ['73ea3f64-6c0a-4f95-92fb-1169d0e76ff9', '2.2'],
    ['6f91c90f-e6e2-457a-8653-13e2bc32ecfa', '2.3'],
    ['b2352dc0-25f5-4ba4-8fd1-fc360ef253c9', '3']
  ])('resolves id %s to question number %s', (id, questionNumber) => {
    expect(resolveQuestionNumber(topLevelQuestions, id)).toBe(questionNumber);
  });

  it('resolves to an empty string if there are no matching question ids', () => {
    expect(resolveQuestionNumber(topLevelQuestions, '0fbbe872-70a4-4d91-a812-c00fd623c908')).toBe('');
  });
});

describe('resolveNextQuestionNumber', () => {
  it('creates a top-level question number', () => {
    expect(resolveNextQuestionNumber(topLevelQuestions, null)).toBe('4');
  });

  it('creates a second-level question number', () => {
    expect(resolveNextQuestionNumber(topLevelQuestions, '226a0af7-9704-4fcf-8d26-27f01a81f484')).toBe('2.4');
    expect(resolveNextQuestionNumber(topLevelQuestions, 'b2352dc0-25f5-4ba4-8fd1-fc360ef253c9')).toBe('3.1');
  });

  it('creates a third-level question number', () => {
    expect(resolveNextQuestionNumber(topLevelQuestions, '6bebfec8-3b85-4f2e-8d3b-7e93c67fbbfd')).toBe('1.2.4');
  });
});
