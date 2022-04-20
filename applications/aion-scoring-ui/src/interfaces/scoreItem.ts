import { QuestionType } from './questionType';

export interface IScoreItem {
  id: string;
  name: string;
  isActive: boolean;
  totalPointsAvailable: number;
  questionType: QuestionType;
  questionSectionId: string;
  questionId: string;
  answerValues: string;
  scoreSetId: string;
  scoreTypeId: string;
  questionAntithesis: boolean | null;
  awardOnAnyListedCheckboxChoice: boolean;
}

export interface IAddScoreItem {
  name: string;
  isActive: boolean;
  totalPointsAvailable: number;
  questionType: QuestionType;
  questionSectionId: string;
  questionId: string;
  answerValues: string;
  scoreSetId: string;
  scoreTypeId: string;
  questionAntithesis: boolean | null;
  awardOnAnyListedCheckboxChoice: boolean;
}
