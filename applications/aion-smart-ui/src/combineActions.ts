import { Actions as AddSiteActions } from 'actions/addSite';
import { Actions as FetchWorkerActions } from 'actions/fetchWorker';
import { Actions as ContactsActions } from 'actions/contacts';
import { Actions as ContractorActions } from 'actions/contractor';
import { Actions as CreateEmployedTraineeActions } from 'actions/createEmployedTrainee';
import { Actions as FetchContactActions } from 'actions/fetchContact';
import { Actions as FetchSiteActions } from 'actions/fetchSite';
import { Actions as FetchTraineesActions } from 'actions/fetchTrainees';
import { Actions as AddContactActions } from 'actions/addContact';
import { Actions as AddTraineeEmployerActions } from 'actions/addTraineeEmployer';
import { Actions as UpdateSiteActions } from 'actions/updateSite';
import { Actions as DeleteSiteActions } from 'actions/deleteSite';
import { Actions as UpdateContactActions } from 'actions/updateContact';
import { Actions as DeleteContactActions } from 'actions/deleteContact';
import { Actions as OrganizationActions } from 'actions/organizations';
import { Actions as UpdateWorkerActions } from 'actions/updateWorker';
import { Actions as ReportActions } from 'actions/report';
import { Actions as SiteLocationActions } from 'actions/siteLocation';
import { Actions as SitesActions } from 'actions/sites';
import { Actions as SiteTagsActions } from 'actions/siteTags';
import { Actions as TrainingRequirementsActions } from 'actions/trainingRequirements';
import { Actions as SearchTraineesActions } from 'actions/searchTrainees';
import { Actions as WorkersActions } from 'actions/workers';
import { Actions as JobTrainingActions } from 'actions/fetchEmployeeJobTraining';
import { Actions as SelectTypeActions } from 'actions/selectTag';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type SiteActions = AddSiteActions | FetchSiteActions | UpdateSiteActions | DeleteSiteActions;
export type ContactActions = AddContactActions | FetchContactActions | UpdateContactActions | DeleteContactActions;
export type WorkerActions = FetchWorkerActions | UpdateWorkerActions;
export type TraineesActions = FetchTraineesActions | AddTraineeEmployerActions;
export type RootActions =
  | CommonRootActions
  | SiteActions
  | ContactActions
  | WorkerActions
  | ContactsActions
  | ContractorActions
  | CreateEmployedTraineeActions
  | OrganizationActions
  | ReportActions
  | SiteLocationActions
  | SitesActions
  | SiteTagsActions
  | SearchTraineesActions
  | TraineesActions
  | TrainingRequirementsActions
  | WorkersActions
  | JobTrainingActions
  | SelectTypeActions;
