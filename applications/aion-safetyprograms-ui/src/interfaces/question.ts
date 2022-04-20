// Questions on an nested question go n-levels deep
export interface INestedQuestion extends IQuestion {
  questions: INestedQuestion[];
}

// Questions on an expanded question only go one level deep
export interface IExpandedQuestion extends IQuestion {
  questions: IQuestion[];
}

export interface IQuestion extends IEditQuestion {
  updatedBy: string;
  updatedDateUtc: string;
  sortOrder: number;
}

export interface IEditQuestion extends IAddQuestion {
  id: string;
}

export interface IAddQuestion {
  title: string;
  safetyProgramId: string;
  parentQuestionId: string | null;
  body: string | null;
  gracePeriodExpirationDateUtc: string | null;
  gracePeriodNeeded?: boolean;
}
