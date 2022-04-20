import { IBusinessUnit } from './businessUnit';
import { IClient } from './client';
import { IRegionalService } from './regionalService';
import { ISafetyProgram } from './safetyProgram';

export interface IExpandedMandate extends IMandate {
  safetyProgram: ISafetyProgram;
  client: IClient;
  businessUnits: IBusinessUnit[];
  regionalServices: IRegionalService[];
}

export interface IMandate {
  id: string;
  clientId: string;
  clientName: string;
  safetyProgramId: string;
  safetyProgramTitle: string;
  gracePeriodExpirationDateUtc: string | null;
  gracePeriodNeeded?: boolean;
  updatedBy: string;
  updatedDateUtc: string;
}

export interface IMandateForm {
  id?: string;
  clientId: string;
  safetyProgramId: string;
  businessUnitIds: string[];
  regionalServiceIdsByRegion: { [serviceRegionId: string]: string[] };
  assigneesType: 'allContractors' | 'businessUnits' | 'services';
  gracePeriodExpirationDateUtc: string | null;
  gracePeriodNeeded?: boolean;
}
