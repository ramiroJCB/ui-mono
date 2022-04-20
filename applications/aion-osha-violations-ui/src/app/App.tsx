import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { Routes } from './Routes';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
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
                  path="/:basepath?/:organizationId?"
                  render={({
                    location,
                    match: {
                      params: { organizationId: possibleOrganizationId, basepath }
                    }
                  }) => {
                    const organizationId = basepath === 'organizations' ? possibleOrganizationId : undefined;
                    return (
                      <RegisterInterceptors organizationId={organizationId}>
                        <NavContainer
                          organizationId={organizationId}
                          title={t('oshaViolations.oshaViolations', 'OSHA Violations')}
                          location={location}
                        >
                          <Routes />
                          <Footer />
                        </NavContainer>
                      </RegisterInterceptors>
                    );
                  }}
                />
              </React.Fragment>
            </SnackbarProvider>
          </Theme>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
