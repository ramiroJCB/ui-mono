import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { reducer as contractors, State as ContractorsState } from 'features/contractors/reducer';
import { reducer as envelope, State as EnvelopeState } from 'features/envelope/reducer';
import { reducer as envelopes, State as EnvelopesState } from 'features/envelopes/reducer';
import { reducer as templates, State as TemplatesState } from 'features/templates/reducer';

type AppRootState = {
  contractors: ContractorsState;
  envelope: EnvelopeState;
  envelopes: EnvelopesState;
  templates: TemplatesState;
};

export type RootState = AppRootState & CommonRootState;

export const rootReducer = combineReducers<RootState>({
  ...commonRootReducer,
  contractors,
  envelope,
  envelopes,
  templates
});
