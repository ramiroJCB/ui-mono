import { Moment } from 'moment';

export interface IBaseAnswer {
  inspectionId: string;
  questionId: string;
  value: Moment | string | string[];
}
export interface IAnswer extends IBaseAnswer {
  id: string;
  organizationId: string;
  sectionId: string;
  isDeleted: boolean;
}
