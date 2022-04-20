import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { FormStateMap, reducer as formReducer } from 'redux-form';
import {
  reducer as autocompleteContractors,
  State as AutocompleteContractorsState
} from 'features/autocompleteContractors/reducer';
import {
  reducer as operationalContractors,
  State as OperationalContractorsState
} from 'features/reporting/operational/contractors/reducer';
import {
  reducer as operationalContractorPeriods,
  State as OperationalContractorPeriodsState
} from 'features/reporting/operational/contractorPeriods/reducer';
import {
  reducer as clientIncidentCategories,
  State as ClientIncidentCategoriesState
} from 'features/reporting/incidents/clientCategories/reducer';
import {
  reducer as clientIncidentCategory,
  State as ClientIncidentCategoryState
} from 'features/reporting/incidents/clientCategory/reducer';
import {
  reducer as clientIncidentRegions,
  State as ClientIncidentRegionsState
} from 'features/reporting/incidents/clientRegions/reducer';
import {
  reducer as clientIncidentRegion,
  State as ClientIncidentRegionState
} from 'features/reporting/incidents/clientRegion/reducer';
import {
  reducer as clientIncidentWorkGroups,
  State as ClientIncidentWorkGroupsState
} from 'features/reporting/incidents/clientWorkGroups/reducer';
import {
  reducer as clientIncidentWorkGroup,
  State as ClientIncidentWorkGroupState
} from 'features/reporting/incidents/clientWorkGroup/reducer';
import {
  reducer as clientIncidentRootCause,
  State as ClientIncidentRootCauseState
} from 'features/reporting/incidents/clientRootCause/reducer';
import {
  reducer as clientIncidentRootCauses,
  State as ClientIncidentRootCausesState
} from 'features/reporting/incidents/clientRootCauses/reducer';
import {
  reducer as clientIncidentTypes,
  State as ClientIncidentTypesState
} from 'features/reporting/incidents/clientTypes/reducer';
import {
  reducer as clientIncidentType,
  State as ClientIncidentTypeState
} from 'features/reporting/incidents/clientType/reducer';
import {
  reducer as regionalMetricValues,
  State as RegionalMetricValuesState
} from 'features/reporting/regional/metricValues/reducer';
import { reducer as incident, State as IncidentState } from 'features/reporting/incidents/addIncident/reducer';
import { reducer as incidents, State as IncidentsState } from 'features/reporting/incidents/reducer';
import { reducer as contractors, State as ContractorsState } from 'features/contractors/reducer';
import {
  reducer as regionalContractors,
  State as RegionalContractorsState
} from 'features/reporting/regional/contractors/reducer';
import { reducer as regionalMetrics, State as RegionalMetricsState } from 'features/reporting/regional/metrics/reducer';
import {
  reducer as regionalReportOptions,
  State as RegionalReportOptionsState
} from 'features/reporting/regional/clientRegionalReportOptions/reducer';
import {
  reducer as regionalReportSettings,
  State as RegionalReportSettingsState
} from 'features/reporting/regional/clientRegionalReportSettings/reducer';
import {
  reducer as operationalMetrics,
  State as OperationalMetricsState
} from 'features/reporting/operational/metrics/reducer';
import { reducer as regions, State as RegionsState } from 'features/reporting/regional/regions/reducer';
import {
  reducer as operationalMetricValuesByContractor,
  State as OperationalMetricValuesByContractorState
} from 'features/reporting/operational/metricValuesByContractor/reducer';
import {
  reducer as periodRegionsByContractor,
  State as PeriodRegionsByContractorState
} from 'features/reporting/regional/periodRegionsByContractor/reducer';
import {
  reducer as regionalMetricValuesByContractor,
  State as RegionalMetricValuesByContractorState
} from 'features/reporting/regional/metricValuesByContractor/reducer';
import { reducer as options, State as OptionsState } from 'features/options/reducer';
import {
  reducer as operationalMetricValues,
  State as OperationalMetricValuesState
} from 'features/reporting/operational/metricValues/reducer';
import { reducer as clientPeriods, State as ClientPeriodsState } from 'features/clientPeriods/reducer';
import {
  reducer as regionalContractorPeriods,
  State as RegionalContractorPeriodsState
} from 'features/reporting/regional/contractorPeriods/reducer';
import {
  reducer as regionalChangeLogEntry,
  State as RegionalChangeLogEntryState
} from 'features/reporting/regional/changeLogEntry/reducer';
import {
  reducer as regionalChangeLogByContractor,
  State as RegionalChangeLogByContractorState
} from 'features/reporting/regional/changeLogByContractor/reducer';
import {
  reducer as flexTrackNotificationsByClient,
  State as FlexTrackNotificationsByClientState
} from 'features/reporting/regional/contractorNotificationsByClient/reducer';
import {
  reducer as operationsNotificationsByClient,
  State as OperationsNotificationsByClientState
} from 'features/reporting/operational/contractorNotificationsByClient/reducer';
import {
  reducer as studentEmergencyContactListReportDownload,
  State as StudentEmergencyContactListReportDownloadState
} from 'features/reporting/studentEmergencyContactList/reducer';
import { RootActions } from 'combineActions';

type RegionMetricRootState = {
  options: OptionsState;
  autocompleteContractors: AutocompleteContractorsState;
  clientIncidentCategories: ClientIncidentCategoriesState;
  clientIncidentCategory: ClientIncidentCategoryState;
  clientIncidentRegions: ClientIncidentRegionsState;
  clientIncidentRegion: ClientIncidentRegionState;
  clientIncidentWorkGroups: ClientIncidentWorkGroupsState;
  clientIncidentWorkGroup: ClientIncidentWorkGroupState;
  clientIncidentType: ClientIncidentTypeState;
  clientIncidentTypes: ClientIncidentTypesState;
  clientIncidentRootCause: ClientIncidentRootCauseState;
  clientIncidentRootCauses: ClientIncidentRootCausesState;
  clientPeriods: ClientPeriodsState;
  contractors: ContractorsState;
  flexTrackNotificationsByClient: FlexTrackNotificationsByClientState;
  form: FormStateMap;
  incident: IncidentState;
  incidents: IncidentsState;
  operationalContractors: OperationalContractorsState;
  operationalContractorPeriods: OperationalContractorPeriodsState;
  operationalMetrics: OperationalMetricsState;
  operationalMetricValuesByContractor: OperationalMetricValuesByContractorState;
  operationalMetricValues: OperationalMetricValuesState;
  operationsNotificationsByClient: OperationsNotificationsByClientState;
  periodRegionsByContractor: PeriodRegionsByContractorState;
  regionalChangeLogEntry: RegionalChangeLogEntryState;
  regionalChangeLogByContractor: RegionalChangeLogByContractorState;
  regionalContractors: RegionalContractorsState;
  regionalContractorPeriods: RegionalContractorPeriodsState;
  regionalMetrics: RegionalMetricsState;
  regionalMetricValues: RegionalMetricValuesState;
  regionalMetricValuesByContractor: RegionalMetricValuesByContractorState;
  regionalReportOptions: RegionalReportOptionsState;
  regionalReportSettings: RegionalReportSettingsState;
  regions: RegionsState;
  studentEmergencyContactListReportDownload: StudentEmergencyContactListReportDownloadState;
};

export type RootState = CommonRootState & RegionMetricRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  options,
  autocompleteContractors,
  clientIncidentCategories,
  clientIncidentCategory,
  clientIncidentRegions,
  clientIncidentRegion,
  clientIncidentWorkGroups,
  clientIncidentWorkGroup,
  clientIncidentRootCause,
  clientIncidentRootCauses,
  clientIncidentType,
  clientIncidentTypes,
  clientPeriods,
  contractors,
  flexTrackNotificationsByClient,
  form: formReducer,
  incident,
  incidents,
  operationalContractors,
  operationalContractorPeriods,
  operationalMetrics,
  operationalMetricValues,
  operationalMetricValuesByContractor,
  operationsNotificationsByClient,
  periodRegionsByContractor,
  regionalChangeLogByContractor,
  regionalChangeLogEntry,
  regionalContractors,
  regionalContractorPeriods,
  regionalMetrics,
  regionalMetricValues,
  regionalMetricValuesByContractor,
  regionalReportOptions,
  regionalReportSettings,
  regions,
  studentEmergencyContactListReportDownload
});
