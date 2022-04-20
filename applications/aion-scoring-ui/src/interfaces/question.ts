import { QuestionType } from './questionType';

export interface IQuestion {
  id: string;
  text: string;
  questionSectionId: string;
  questionType: QuestionType;
}
