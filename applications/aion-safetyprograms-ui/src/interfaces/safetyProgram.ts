import { INestedQuestion } from './question';

export enum SafetyProgramStatus {
  Valid = 'Valid',
  Invalid = 'Invalid'
}

export interface IExpandedSafetyProgram extends ISafetyProgram {
  questions: INestedQuestion[];
}

export interface ISafetyProgram extends IEditSafetyProgram {
  status: SafetyProgramStatus;
  showShopLink: boolean;
  shopLink: string;
  questionCount: number;
  updatedBy: string;
  updatedDateUtc: string;
}

export interface IEditSafetyProgram extends IAddSafetyProgram {
  id: string;
}

export interface IAddSafetyProgram {
  title: string;
  gracePeriodExpirationDateUtc: string | null;
  gracePeriodNeeded?: boolean;
}

export interface IEditShopLinksForm {
  safetyProgramIds: string[];
}
