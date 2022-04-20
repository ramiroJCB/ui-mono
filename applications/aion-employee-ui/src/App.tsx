import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { EmployeesContainer } from 'containers/employeesContainer';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { LinkEmployees } from 'components/LinkEmployees';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { SnackbarProvider } from 'notistack';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <React.Fragment>
            <NotifierContainer />
            <Router basename="/organizations">
              <Theme>
                {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
                <Route
                  path="/:organizationId?"
                  render={({
                    location,
                    match: {
                      params: { organizationId }
                    }
                  }) => (
                    <RegisterInterceptors organizationId={organizationId}>
                      <NavContainer
                        organizationId={organizationId}
                        title={t('employee.employees', 'Employees')}
                        location={location}
                      >
                        <Switch>
                          <Route path="/:organizationId/employees/link" component={LinkEmployees} />
                          <Route path="/:organizationId/employees" component={EmployeesContainer} />
                          <Redirect from="/:organizationId" to="/:organizationId/employees" />
                        </Switch>
                        <Footer />
                      </NavContainer>
                    </RegisterInterceptors>
                  )}
                />
              </Theme>
            </Router>
          </React.Fragment>
        </SnackbarProvider>
      </Provider>
    </ErrorBoundary>
  );
};
