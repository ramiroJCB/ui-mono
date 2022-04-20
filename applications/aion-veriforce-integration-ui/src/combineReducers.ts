import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { reducer as veriforceOrganization, State as VeriforceOrganizationState } from 'reducers/veriforceOrganization';
import { RootActions } from 'combineActions';

type VeriforceIntegrationRootState = {
  veriforceOrganization: VeriforceOrganizationState;
};

export type RootState = VeriforceIntegrationRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  veriforceOrganization
});
