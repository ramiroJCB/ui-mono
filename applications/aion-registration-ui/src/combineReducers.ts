import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { FormStateMap, reducer as formReducer } from 'redux-form';
import { reducer as company, State as CompanyState } from './reducers/company';
import { reducer as organizations, State as OrganizationsState } from './reducers/organizations';
import { reducer as trainees, State as TraineesState } from './reducers/trainees';
import { reducer as trainee, State as TraineeState } from './reducers/trainee';
import { RootActions } from './combineActions';

type RegistrationRootState = {
  form: FormStateMap;
  company: CompanyState;
  organizations: OrganizationsState;
  trainees: TraineesState;
  trainee: TraineeState;
};

export type RootState = RegistrationRootState & CommonRootState;
export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  company,
  form: formReducer,
  organizations,
  trainees,
  trainee
});
