export enum AnswerStatus {
  Incomplete = 'Incomplete',
  Completable = 'Completable',
  Acceptable = 'Acceptable',
  AcceptableOrRejectable = 'AcceptableOrRejectable',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  AutoRejected = 'AutoRejected'
}

export interface IAnswer {
  id: string;
  questionId: string;
  organizationId: string;
  safetyProgramRequirementId: string;
  answerValue: boolean;
  status: AnswerStatus;
  commentCount: number;
  hasUnreadEvaluatorComments: boolean;
  hasUnreadContractorComments: boolean;
}

export interface IAnswerForm {
  id?: string;
  questionId: string;
  organizationId: string;
  safetyProgramRequirementId: string;
  answerValue: 'true' | 'false';
}
