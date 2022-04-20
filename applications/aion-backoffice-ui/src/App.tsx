import * as React from 'react';
import HomePage from './components/HomePage';
import ManageOrganization from './containers/ManageOrganization';
import ManageOrganizationFeatures from './containers/ManageGlobalOrganizationFeatures';
import ManageUser from './containers/ManageUser';
import ManageUserActivities from './containers/ManageUserActivities';
import OrganizationsResults from './containers/OrganizationsResults';
import SearchOrganizations from './components/SearchOrganizations';
import SearchUsers from './components/SearchUsers';
import store from './store';
import UsersResults from './containers/UsersResults';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error } from '@pec/aion-ui-components/components/Error';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { SnackbarProvider } from 'notistack';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename="/backoffice">
        <Theme>
          <SnackbarProvider
            maxSnack={2}
            preventDuplicate
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <React.Fragment>
              <NotifierContainer />

              {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
              <Route
                render={({ location }) => (
                  <RegisterInterceptors>
                    <NavContainer location={location}>
                      <Switch>
                        <Route path="/organizationFeatures" component={ManageOrganizationFeatures} />
                        <Route
                          path="/organizations/search/:searchTerm/page/:pageNumber(\d+)"
                          component={OrganizationsResults}
                        />
                        <Route path="/organizations/:organizationId" component={ManageOrganization} />
                        <Route path="/organizations" component={SearchOrganizations} />
                        <Route path="/users/search/:searchTerm/page/:pageNumber(\d+)" component={UsersResults} />
                        <Route
                          path="/users/:userId/permissions/:activityType/:scopeId?"
                          component={ManageUserActivities}
                        />
                        <Route path="/users/:userId" component={ManageUser} />
                        <Route path="/users" component={SearchUsers} />
                        <Route path="/" component={HomePage} />
                        <Route component={Error} />
                      </Switch>
                      <Footer />
                    </NavContainer>
                  </RegisterInterceptors>
                )}
              />
            </React.Fragment>
          </SnackbarProvider>
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);

export default App;
