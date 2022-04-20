import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { RoutesContainer } from 'routes';
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
        <Router basename="/organizations">
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
                          title={t('trainingCompliance.common.trainingCompliance', 'Training Compliance')}
                          location={location}
                        >
                          <GridContainer style={{ position: 'relative' }}>
                            <RoutesContainer />
                          </GridContainer>
                          <Footer />
                        </NavContainer>
                      </HotJarWrapper>
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
};
