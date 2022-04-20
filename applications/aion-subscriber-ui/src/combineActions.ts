import { Actions as InsurancesActions } from 'actions/insurances';
import { Actions as ReleasesActions } from 'actions/releases';
import { Actions as VerificationsActions } from 'actions/verifications';
import { Actions as PredictiveRankingActions } from 'actions/predictiveRanking';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | CommonRootActions
  | InsurancesActions
  | PredictiveRankingActions
  | ReleasesActions
  | VerificationsActions;
