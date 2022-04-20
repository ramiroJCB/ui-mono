import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { DashboardContainer } from 'components/Dashboard';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { Provider } from 'react-redux';
import { QuestionnaireContainer } from 'containers/Questionnaire';
import { QuestionnaireRedirectContainer } from 'containers/Questionnaire/QuestionnaireRedirect';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
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
        <Router basename="/organizations">
          <Theme>
            {process.env.NODE_ENV === 'production' && (
              <React.Fragment>
                <Route component={Trackers} />
                <Route component={WalkMeContainer} />
              </React.Fragment>
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
                      title={t('subscriber.compliancePro', 'Compliance Pro')}
                      location={location}
                    >
                      <Switch>
                        <Route
                          path="/:organizationId/questionnaire/:questionnaireSectionId"
                          component={QuestionnaireContainer}
                        />
                        <Route path="/:organizationId/questionnaire" component={QuestionnaireRedirectContainer} />
                        <Route path="/:organizationId" component={DashboardContainer} />
                        <Route path="/" render={() => null} />
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
