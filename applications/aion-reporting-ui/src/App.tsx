import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import store from 'store';
import { AddClientCategoryContainer } from 'features/reporting/incidents/clientCategory/containers/AddClientCategory';
import { AddClientRegionContainer } from 'features/reporting/incidents/clientRegion/containers/AddClientRegion';
import { AddClientRootCauseContainer } from 'features/reporting/incidents/clientRootCause/containers/AddClientRootCause';
import { AddClientTypeContainer } from 'features/reporting/incidents/clientType/containers/AddClientType';
import { AddClientWorkGroupContainer } from 'features/reporting/incidents/clientWorkGroup/containers/AddClientWorkGroup';
import { AddIncidentFormContainer } from 'features/reporting/incidents/addIncident/containers/AddIncidentForm';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ClientOperationsContainer } from 'features/reporting/operational/clientOperations/containers/ClientOperations';
import { ClientRegionalContainer } from 'features/reporting/regional/client/containers/ClientRegional';
import { ContractorOperationsContainer } from 'features/reporting/operational/contractorOperations/containers/ContractorOperations';
import { ContractorRegionalContainer } from 'features/reporting/regional/contractor/containers/ContractorRegional';
import { DownloadStudentEmergencyContactListReportContainer } from 'features/reporting/studentEmergencyContactList/containers/DownloadStudentEmergencyContactListReport';
import { EditClientCategoryContainer } from 'features/reporting/incidents/clientCategory/containers/EditClientCategory';
import { EditClientRegionContainer } from 'features/reporting/incidents/clientRegion/containers/EditClientRegion';
import { EditClientRootCauseContainer } from 'features/reporting/incidents/clientRootCause/containers/EditClientRootCause';
import { EditClientTypeContainer } from 'features/reporting/incidents/clientType/containers/EditClientType';
import { EditClientWorkGroupContainer } from 'features/reporting/incidents/clientWorkGroup/containers/EditClientWorkGroup';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { FlexTrackNotificationsByClientContainer } from 'features/reporting/regional/contractorNotificationsByClient/containers/FlexTrackNotificationsByClient';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { getReportTypes } from 'helpers';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { IncidentsReportContainer } from 'features/reporting/incidents/containers/IncidentsReport';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { OperationsNotificationsByClientContainer } from 'features/reporting/operational/contractorNotificationsByClient/containers/OperationsNotificationsByClient';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Provider } from 'react-redux';
import { RedirectByOrganizationFeatureContainer } from 'features/redirect/containers/RedirectByOrganizationFeature';
import { RedirectToFirstClientContainer } from 'features/redirect/containers/RedirectToFirstClient';
import { RedirectToFirstPeriodContainer } from 'features/redirect/containers/RedirectToFirstPeriod';
import { RegionalReportSettingsContainer } from 'features/reporting/regional/clientRegionalReportSettings/containers/RegionalReportSettings';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { SelectClientContainer } from '@pec/aion-ui-components/containers/SelectClient';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { WalkMeContainer } from '@pec/aion-ui-components/containers/WalkMe';
import { useTranslation } from 'react-i18next';

const {
  FlexTrack,
  IncidentReports,
  OperationalMetrics,
  RegionMetrics,
  RegionMetricsWithoutTotal
} = OrganizationFeature;

const reportTypes = getReportTypes();

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router basename="/organizations">
          <Theme>
            {process.env.NODE_ENV === 'production' && (
              <>
                <Route component={Trackers} />
                <Route component={WalkMeContainer} />
              </>
            )}
            <Route
              path="/:organizationId?"
              render={({
                location,
                match: {
                  params: { organizationId }
                }
              }) => (
                <RegisterInterceptors organizationId={organizationId}>
                  <HotJarWrapper>
                    <NavContainer
                      organizationId={organizationId}
                      title={t('reporting.components.reporting', 'Reporting')}
                      location={location}
                    >
                      <Switch>
                        <Route
                          path="/:organizationId/reporting/operations/periods/:periodId"
                          component={ClientOperationsContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/operations/clients/:clientId/periods/:periodId"
                          component={ContractorOperationsContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/add/clients/:clientId"
                          component={AddIncidentFormContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/add"
                          render={props => (
                            <SelectClientContainer organizationFeatures={[IncidentReports]} {...props}>
                              {({ id, name }) => (
                                <IconCard
                                  to={`/${organizationId}/reporting/incidents/add/clients/${id}`}
                                  icon={<BusinessIcon />}
                                  primaryText={name}
                                />
                              )}
                            </SelectClientContainer>
                          )}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/categories/edit/:incidentCategoryId"
                          component={EditClientCategoryContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/regions/edit/:incidentRegionId"
                          component={EditClientRegionContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/rootCauses/edit/:incidentRootCauseId"
                          component={EditClientRootCauseContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/types/edit/:incidentTypeId"
                          component={EditClientTypeContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/workGroups/edit/:incidentWorkGroupId"
                          component={EditClientWorkGroupContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/categories"
                          component={AddClientCategoryContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/regions"
                          component={AddClientRegionContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/incidents/rootCauses"
                          component={AddClientRootCauseContainer}
                        />
                        <Route path="/:organizationId/reporting/incidents/types" component={AddClientTypeContainer} />
                        <Route
                          path="/:organizationId/reporting/incidents/workGroups"
                          component={AddClientWorkGroupContainer}
                        />
                        <Route path="/:organizationId/reporting/incidents" component={IncidentsReportContainer} />
                        <Route
                          path="/:organizationId/reporting/regional/clients/:clientId/periods/:periodId"
                          component={ContractorRegionalContainer}
                        />
                        <Route
                          path={`/:organizationId/reporting/:reportType(${reportTypes})/clients/:clientId`}
                          component={RedirectToFirstPeriodContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/regional/clients"
                          render={props => (
                            <SelectClientContainer
                              organizationFeatures={[RegionMetrics, RegionMetricsWithoutTotal, FlexTrack]}
                              {...props}
                            >
                              {client => (
                                <FlexTrackNotificationsByClientContainer
                                  client={client}
                                  organizationId={organizationId}
                                />
                              )}
                            </SelectClientContainer>
                          )}
                        />
                        <Route
                          path="/:organizationId/reporting/operations/clients"
                          render={props => (
                            <SelectClientContainer organizationFeatures={[OperationalMetrics]} {...props}>
                              {client => (
                                <OperationsNotificationsByClientContainer
                                  client={client}
                                  organizationId={organizationId}
                                />
                              )}
                            </SelectClientContainer>
                          )}
                        />
                        <Route
                          path="/:organizationId/reporting/student-emergency-contact-list/download/:reportId"
                          component={DownloadStudentEmergencyContactListReportContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/regional/periods/:periodId"
                          component={ClientRegionalContainer}
                        />
                        <Route
                          path="/:organizationId/reporting/regional/settings"
                          component={RegionalReportSettingsContainer}
                        />
                        <Route
                          path={`/:organizationId/reporting/:reportType(${reportTypes})/clients`}
                          component={RedirectToFirstClientContainer}
                        />
                        <Route
                          path={`/:organizationId/reporting/:reportType(${reportTypes})/periods`}
                          component={RedirectToFirstPeriodContainer}
                        />
                        <Route path="/:organizationId" component={RedirectByOrganizationFeatureContainer} />
                      </Switch>
                      <Footer />
                    </NavContainer>
                  </HotJarWrapper>
                </RegisterInterceptors>
              )}
            />
          </Theme>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
