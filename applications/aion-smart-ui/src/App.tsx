import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { AddContactContainer } from 'containers/AddContact';
import { AddSiteContainer } from 'containers/AddSite';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ContactsContainer } from './containers/Contacts';
import { ContactsTabletContainer } from './containers/ContactsTablet';
import { ContractorContainer } from './containers/Contractor';
import { EditContactContainer } from './containers/Contact';
import { EditSiteContainer } from './containers/EditSite';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { ReportFormContainer } from './containers/ReportForm';
import { SiteContainer } from './containers/Site';
import { SiteInfoContainer } from './containers/SiteInfo';
import { SitesContainer } from './containers/Sites';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { UserOrganizationsContainer } from './containers/UserOrganizations';
import { WorkerContainer } from './containers/Worker';
import { WorkersContainer } from './containers/Workers';
import { ScanIdentifyWorkerComponenet } from './containers/ScanIdentifyWorker';

declare global {
  interface Window {
    google: any;
  }
}

const App: React.SFC<WithWidth> = ({ width }) => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename="/smart">
        <Theme>
          {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
          <Route
            path="/:organizationId?"
            render={({
              match: {
                params: { organizationId }
              }
            }) => (
              <RegisterInterceptors organizationId={organizationId}>
                <Switch>
                  <Route
                    path="/:organizationId/sites/:siteId/contractors/:contractorId"
                    component={isWidthUp('md', width) ? SiteContainer : ContractorContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/workers/:employeeId"
                    component={isWidthUp('md', width) ? SiteContainer : WorkerContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/workers"
                    component={isWidthUp('lg', width) ? SiteContainer : WorkersContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/contacts/:mode(add)"
                    component={isWidthUp('md', width) ? ContactsTabletContainer : AddContactContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/contacts/:contactId/:mode(edit)?"
                    component={isWidthUp('md', width) ? ContactsTabletContainer : EditContactContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/contacts"
                    component={isWidthUp('md', width) ? ContactsTabletContainer : ContactsContainer}
                  />
                  <Route
                    path="/:organizationId/sites/:siteId/edit/:mode(location|details)"
                    component={EditSiteContainer}
                  />
                  <Route path="/:organizationId/sites/add/:mode(location|details)" component={AddSiteContainer} />
                  <Route path="/:organizationId/sites/:siteId/info" component={SiteInfoContainer} />
                  <Route path="/:organizationId/sites/:siteId/scanBarcode" component={ScanIdentifyWorkerComponenet} />
                  <Route path="/:organizationId/sites/:siteId/workerId/:workerId" component={SiteContainer} />
                  <Route path="/:organizationId/sites/:siteId" component={SiteContainer} />
                  <Route path="/:organizationId/sites" component={SitesContainer} />
                  <Route path="/:organizationId/reports" component={ReportFormContainer} />
                  <Route
                    path="/:organizationId"
                    render={({
                      match: {
                        params: { organizationId }
                      }
                    }) => <Redirect to={`/${organizationId}/sites`} />}
                  />
                  <Route path="/" component={UserOrganizationsContainer} />
                </Switch>
              </RegisterInterceptors>
            )}
          />
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);

export default withWidth()(App);
