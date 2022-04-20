import { locateQuestion } from './locateQuestion';
import { topLevelQuestions } from './fixtures';

it('locates a top-level question', () => {
  expect(locateQuestion(topLevelQuestions, '226a0af7-9704-4fcf-8d26-27f01a81f484')).toEqual(topLevelQuestions[1]);
});

it('locates nested questions', () => {
  expect(locateQuestion(topLevelQuestions, '17766ddc-10fb-468b-949b-f21efc184283')).toEqual(
    topLevelQuestions[0].questions[1].questions[1]
  );
  expect(locateQuestion(topLevelQuestions, '6f91c90f-e6e2-457a-8653-13e2bc32ecfa')).toEqual(
    topLevelQuestions[1].questions[2]
  );
});

it("returns undefined if there's no match", () => {
  expect(locateQuestion(topLevelQuestions, 'e8bc4725-c570-4976-83ca-1e53f131127c')).toBe(undefined);
});
