import { Actions as AddCompanyActions } from './actions/addCompany';
import { Actions as AddTraineeActions } from './actions/addTrainee';
import { Actions as FetchTraineeActions } from './actions/fetchTrainee';
import { Actions as UpdateTraineeActions } from './actions/updateTrainee';
import { Actions as FetchTraineesActions } from './actions/fetchTrainees';
import { Actions as OrganizationsActions } from './actions/organizations';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type CompanyActions = AddCompanyActions;
export type TraineeActions = AddTraineeActions | FetchTraineeActions | UpdateTraineeActions;
export type TraineesActions = FetchTraineesActions;
export type RootActions = CommonRootActions | CompanyActions | OrganizationsActions | TraineeActions | TraineesActions;
