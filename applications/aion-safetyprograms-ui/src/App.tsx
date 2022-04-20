import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { EvaluationsRoutes } from 'features/evaluations/Routes';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { RequirementsRoutes } from 'features/requirements/Routes';
import { SafetyProgramsRoutes } from 'features/safetyPrograms/Routes';
import { SnackbarProvider } from 'notistack';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { WalkMeContainer } from '@pec/aion-ui-components/containers/WalkMe';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
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
                {process.env.NODE_ENV === 'production' && (
                  <React.Fragment>
                    <Route component={Trackers} />
                    <Route component={WalkMeContainer} />
                  </React.Fragment>
                )}
                <Route
                  path="/:basepath?/:organizationId?"
                  render={({
                    location,
                    match: {
                      params: { basepath, organizationId: possibleOrganizationId }
                    }
                  }) => {
                    const organizationId = basepath === 'organizations' ? possibleOrganizationId : undefined;

                    return (
                      <RegisterInterceptors organizationId={organizationId}>
                        <HotJarWrapper>
                          <NavContainer
                            organizationId={organizationId}
                            title={t('safetyPrograms.common.programReviews', 'Program Reviews')}
                            location={location}
                          >
                            <Switch>
                              <Route path="/organizations/:organizationId" component={RequirementsRoutes} />
                              <Route path="/safety-program-requirements" component={EvaluationsRoutes} />
                              <Route path="/safety-programs" component={SafetyProgramsRoutes} />
                              <Redirect to="/safety-program-requirements" />
                            </Switch>
                            <Footer />
                          </NavContainer>
                        </HotJarWrapper>
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
