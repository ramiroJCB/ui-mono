export type ITraineeCourseCredit = {
  trainingCourseId: string;
  traineeId: string;
  courseName: string;
  trainingLevel: string;
  validatingCompanyId?: string | null;
  validatingCompanyName: string;
  passed: boolean;
  //misspelling preserved from legacy model
  granfathered: boolean;
  revoked: boolean;
  courseExpired: boolean;
  retrainingNecessary: boolean;
  updatedDateUtc: string;
  completionDate?: string | null;
  userId: string;
};
