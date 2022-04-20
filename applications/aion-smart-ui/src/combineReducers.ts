import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { FormStateMap, reducer as formReducer } from 'redux-form';
import { reducer as contact, State as ContactState } from 'reducers/contact';
import { reducer as sites, State as SitesState } from 'reducers/sites';
import { reducer as workers, State as WorkersState } from 'reducers/workers';
import { reducer as employedTrainee, State as EmployedTraineeState } from 'reducers/employedTrainee';
import { reducer as trainees, State as TraineesState } from 'reducers/trainees';
import { reducer as siteLocation, State as SiteLocationState } from 'reducers/siteLocation';
import { reducer as report, State as ReportState } from 'reducers/report';
import { reducer as contacts, State as ContactsState } from 'reducers/contacts';
import { reducer as siteTags, State as SiteTagsState } from 'reducers/siteTags';
import { reducer as searchTrainees, State as SearchTraineesState } from 'reducers/searchTrainees';
import { reducer as trainingRequirements, State as TrainingRequirementsState } from 'reducers/trainingRequirements';
import { reducer as worker, State as WorkerState } from 'reducers/worker';
import { reducer as contractor, State as ContractorState } from 'reducers/contractor';
import { reducer as autocompleteOrganizations, State as OrganizationsState } from 'reducers/organizations';
import { reducer as site, State as SiteState } from 'reducers/site';
import { reducer as workGroups, State as WorkGroupsState } from 'reducers/workGroups';
import {
  reducer as trainingProgramsByWorkgroup,
  State as TrainingProgramsByWorkgroupState
} from 'reducers/trainingProgramsByWorkgroup';
import { RootActions } from 'combineActions';

type SmartRootState = {
  form: FormStateMap;
  contacts: ContactsState;
  contact: ContactState;
  contractor: ContractorState;
  employedTrainee: EmployedTraineeState;
  trainees: TraineesState;
  autocompleteOrganizations: OrganizationsState;
  report: ReportState;
  site: SiteState;
  siteLocation: SiteLocationState;
  sites: SitesState;
  siteTags: SiteTagsState;
  searchTrainees: SearchTraineesState;
  trainingRequirements: TrainingRequirementsState;
  worker: WorkerState;
  workers: WorkersState;
  workGroups: WorkGroupsState;
  trainingProgramsByWorkgroup: TrainingProgramsByWorkgroupState;
};

export type RootState = SmartRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  form: formReducer,
  contact,
  contacts,
  contractor,
  employedTrainee,
  autocompleteOrganizations,
  report,
  site,
  siteLocation,
  sites,
  siteTags,
  searchTrainees,
  trainees,
  trainingRequirements,
  worker,
  workers,
  workGroups,
  trainingProgramsByWorkgroup
});
