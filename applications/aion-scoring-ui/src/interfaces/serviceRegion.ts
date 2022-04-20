import { CommonState } from '@pec/aion-ui-core/slices/common';
import { IScoreSet } from './scoreSet';

interface IServiceRegionScoreSetState extends CommonState {
  scoreSets: IScoreSet[] | null;
}

export interface IServiceRegion {
  id: string;
  serviceRegionName: string;
  serviceRegionId: string;
  clientId: string;
  scoreSetsState: IServiceRegionScoreSetState;
}
