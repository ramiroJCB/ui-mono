import { Actions as AddClientIncidentRegionActions } from 'features/reporting/incidents/clientRegion/actions/addClientIncidentRegion';
import { Actions as FetchRegionalReportOptionsActions } from 'features/reporting/regional/clientRegionalReportOptions/actions';
import { Actions as UpdateClientIncidentTypeActions } from 'features/reporting/incidents/clientType/actions/updateClientIncidentType';
import { Actions as FetchOperationalMetricsActions } from 'features/reporting/operational/metrics/actions';
import { Actions as FetchOperationalMetricValuesActions } from 'features/reporting/operational/metricValues/actions/fetchOperationalMetricValues';
import { Actions as UpdateOperationalMetricValueActions } from 'features/reporting/operational/metricValues/actions/updateOperationalMetricValue';
import { Actions as FetchOperationalMetricValuesByContractor } from 'features/reporting/operational/metricValuesByContractor/actions';
import { Actions as AddIncidentActions } from 'features/reporting/incidents/addIncident/actions';
import { Actions as AddClientIncidentRootCauseActions } from 'features/reporting/incidents/clientRootCause/actions/addClientIncidentRootCause';
import { Actions as FetchIncidentsByContractorActions } from 'features/reporting/incidents/actions/fetchIncidentsByContractor';
import { Actions as FetchIncidentCategoriesActions } from 'features/reporting/incidents/clientCategories/actions/fetchClientIncidentCategories';
import { Actions as FetchIncidentRegionsActions } from 'features/reporting/incidents/clientRegions/actions/fetchClientIncidentRegions';
import { Actions as FetchIncidentWorkGroupsActions } from 'features/reporting/incidents/clientWorkGroups/actions/fetchClientIncidentWorkGroups';
import { Actions as FetchIncidentRootCausesActions } from 'features/reporting/incidents/clientRootCauses/actions/fetchClientIncidentRootCauses';
import { Actions as FetchIncidentRootCauseActions } from 'features/reporting/incidents/clientRootCause/actions/fetchClientIncidentRootCause';
import { Actions as UpdateClientIncidentRootCauseActions } from 'features/reporting/incidents/clientRootCause/actions/updateClientIncidentRootCause';
import { Actions as UpdateClientIncidentCategoryActions } from 'features/reporting/incidents/clientCategory/actions/updateClientIncidentCategory';
import { Actions as UpdateClientIncidentRegionActions } from 'features/reporting/incidents/clientRegion/actions/updateClientIncidentRegion';
import { Actions as UpdateClientIncidentWorkGroupActions } from 'features/reporting/incidents/clientWorkGroup/actions/updateClientIncidentWorkGroup';
import { Actions as UpdateRegionalReportSettingActions } from 'features/reporting/regional/clientRegionalReportSettings/actions/updateRegionalReportSetting';
import { Actions as FetchClientIncidentCategoryActions } from 'features/reporting/incidents/clientCategory/actions/fetchClientIncidentCategory';
import { Actions as FetchClientIncidentRegionActions } from 'features/reporting/incidents/clientRegion/actions/fetchClientIncidentRegion';
import { Actions as FetchClientIncidentWorkGroupActions } from 'features/reporting/incidents/clientWorkGroup/actions/fetchClientIncidentWorkGroup';
import { Actions as FetchRegionalReportSettingsActions } from 'features/reporting/regional/clientRegionalReportSettings/actions/fetchRegionalReportSettings';
import { Actions as RegionalMetricsActions } from 'features/reporting/regional/metrics/actions';
import { Actions as AddClientIncidentCategoryActions } from 'features/reporting/incidents/clientCategory/actions/addClientIncidentCategory';
import { Actions as AddClientIncidentWorkGroupActions } from 'features/reporting/incidents/clientWorkGroup/actions/addClientIncidentWorkGroup';
import { Actions as AddClientIncidentTypeActions } from 'features/reporting/incidents/clientType/actions/addClientIncidentType';
import { Actions as AddRegionalReportSettingActions } from 'features/reporting/regional/clientRegionalReportSettings/actions/addRegionalReportSetting';
import { Actions as FetchIncidentTypeActions } from 'features/reporting/incidents/clientType/actions/fetchClientIncidentType';
import { Actions as RegionalContractorsActions } from 'features/reporting/regional/contractors/actions';
import { Actions as FetchIncidentTypesActions } from 'features/reporting/incidents/clientTypes/actions/fetchClientIncidentTypes';
import { Actions as FetchRegionalContractorPeriodsActions } from 'features/reporting/regional/contractorPeriods/actions/fetchRegionalContractorPeriods';
import { Actions as UpdateRegionalContractorPeriodStatusActions } from 'features/reporting/regional/contractorPeriods/actions/updateRegionalContractorPeriodStatus';
import { Actions as FetchClientPeriodsActions } from 'features/clientPeriods/actions';
import { Actions as AutocompleteContractorsActions } from 'features/autocompleteContractors/actions';
import { Actions as UpdateRegionalMetricValueActions } from 'features/reporting/regional/metricValues/actions/updateRegionalMetricValue';
import { Actions as RegionalMetricValuesByContractorActions } from 'features/reporting/regional/metricValuesByContractor/actions';
import { Actions as FetchPeriodRegionsByContractor } from 'features/reporting/regional/periodRegionsByContractor/actions';
import { Actions as RegionsActions } from 'features/reporting/regional/regions/actions';
import { Actions as FetchOperationalContractorPeriodsActions } from 'features/reporting/operational/contractorPeriods/actions/fetchOperationalContractorPeriods';
import { Actions as UpdateOperationalContractorPeriodStatusActions } from 'features/reporting/operational/contractorPeriods/actions/updateOperationalContractorPeriodStatus';
import { Actions as ContractorsActions } from 'features/contractors/actions';
import { Actions as OperationalContractorsActions } from 'features/reporting/operational/contractors/actions';
import { Actions as FetchRegionalMetricValuesActions } from 'features/reporting/regional/metricValues/actions/fetchRegionalMetricValues';
import { Actions as RegionalChangeLogByContractorActions } from 'features/reporting/regional/changeLogByContractor/actions';
import { Actions as RegionalChangeLogEntryActions } from 'features/reporting/regional/changeLogEntry/actions';
import { Actions as FlexTrackNotificationsByClientActions } from 'features/reporting/regional/contractorNotificationsByClient/actions';
import { Actions as OperationsNotificationsByClientActions } from 'features/reporting/operational/contractorNotificationsByClient/actions';
import { Actions as StudentEmergencyContactListReportDownloadActions } from 'features/reporting/studentEmergencyContactList/actions';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | AddClientIncidentCategoryActions
  | AddClientIncidentRegionActions
  | AddClientIncidentWorkGroupActions
  | AddClientIncidentTypeActions
  | AddClientIncidentRootCauseActions
  | AddRegionalReportSettingActions
  | CommonRootActions
  | RegionalMetricsActions
  | AutocompleteContractorsActions
  | AddIncidentActions
  | ContractorsActions
  | FetchIncidentsByContractorActions
  | FetchIncidentCategoriesActions
  | FetchIncidentRegionsActions
  | FetchIncidentWorkGroupsActions
  | FetchClientIncidentCategoryActions
  | FetchClientIncidentRegionActions
  | FetchClientIncidentWorkGroupActions
  | FetchPeriodRegionsByContractor
  | FetchRegionalReportOptionsActions
  | FetchRegionalReportSettingsActions
  | FetchIncidentRootCausesActions
  | FetchIncidentRootCauseActions
  | FetchIncidentTypeActions
  | FetchIncidentTypesActions
  | FetchRegionalContractorPeriodsActions
  | FetchOperationalContractorPeriodsActions
  | FetchOperationalMetricsActions
  | FetchOperationalMetricValuesActions
  | FetchOperationalMetricValuesByContractor
  | UpdateOperationalMetricValueActions
  | UpdateClientIncidentCategoryActions
  | UpdateClientIncidentRegionActions
  | UpdateClientIncidentWorkGroupActions
  | UpdateClientIncidentTypeActions
  | UpdateClientIncidentRootCauseActions
  | UpdateOperationalContractorPeriodStatusActions
  | UpdateRegionalContractorPeriodStatusActions
  | UpdateRegionalReportSettingActions
  | RegionalContractorsActions
  | OperationalContractorsActions
  | OperationsNotificationsByClientActions
  | FetchClientPeriodsActions
  | FetchRegionalMetricValuesActions
  | UpdateRegionalMetricValueActions
  | RegionalMetricValuesByContractorActions
  | RegionsActions
  | RegionalChangeLogByContractorActions
  | RegionalChangeLogEntryActions
  | StudentEmergencyContactListReportDownloadActions
  | FlexTrackNotificationsByClientActions;
