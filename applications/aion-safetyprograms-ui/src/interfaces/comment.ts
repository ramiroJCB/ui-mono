export interface IComment {
  id: string;
  questionAnswerId: string;
  contractorId: string;
  comments: string;
  isRead: boolean;
  isEvaluatorComment: boolean;
  createdBy: string;
  createdDateUtc: string;
}
