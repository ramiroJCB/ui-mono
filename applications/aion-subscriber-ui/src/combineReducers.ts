import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { reducer as releases, State as ReleasesState } from 'reducers/releases';
import { reducer as insurances, State as InsurancesState } from 'reducers/insurances';
import { reducer as predictiveRanking, State as PredictiveRankingState } from 'reducers/predictiveRanking';
import { reducer as options, State as OptionsState } from 'reducers/options';
import { reducer as verifications, State as VerificationsState } from 'reducers/verifications';
import { RootActions } from 'combineActions';

export type SubscriberRootState = {
  predictiveRanking: PredictiveRankingState;
  insurances: InsurancesState;
  releases: ReleasesState;
  verifications: VerificationsState;
  options: OptionsState;
};

export type RootState = SubscriberRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  predictiveRanking,
  insurances,
  releases,
  verifications,
  options
});
