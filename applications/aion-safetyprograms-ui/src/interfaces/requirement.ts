import { IAnswer } from './answer';
import { IClient } from './client';
import { IClientGracePeriod } from './clientGracePeriod';
import { INestedQuestion } from './question';
import { IOverride } from './override';
import { ISafetyProgram } from './safetyProgram';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { ClientOverrideStatus } from './requirementOverride';

export interface IClientRequirement {
  id: string;
  clientId: string;
  safetyProgramRequirementId: string;
  isOverridden: boolean;
  numberOfComments: number;
  lastContractorActivityDateUtc: string | null;
  gracePeriodExpirationDateForClient: string | null;
  effectiveGracePeriod: string | null;
  safetyProgramRequirementStatus: SafetyProgramRequirementStatus;
  contractorId: string;
  overrideStatus: ClientOverrideStatus | null;
  contractorCompanyNumber: number;
  contractorName: string;
  safetyProgramId: string;
  safetyProgramTitle: string;
  createdBy: string;
  updatedBy: string;
  createdDateUtc: string;
  updatedDateUtc: string;
}

export interface IContractorRequirement extends IExpandedRequirement {
  safetyProgram: ISafetyProgram;
  questions: INestedQuestion[];
  questionAnswers: IAnswer[];
}

export interface IExpandedRequirement extends IRequirement {
  clients: IClient[];
}

interface IRequirement {
  clientScoreOverrides: IOverride[];
  clientGracePeriods: IClientGracePeriod[];
  hasUnreadEvaluatorComments: boolean;
  hasUnreadContractorComments: boolean;
  contractorCompanyNumber: number | null;
  contractorId: string;
  contractorName: string;
  numberOfComments: number;
  numberOfClients: number;
  id: string;
  lastContractorActivityDateUtc: string | null;
  nearestGracePeriodExpirationDate: string | null;
  safetyProgramId: string;
  safetyProgramTitle: string;
  status: SafetyProgramRequirementStatus;
}
