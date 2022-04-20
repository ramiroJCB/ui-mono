import Grid from '@material-ui/core/Grid';
import logo from 'logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { OrganizationContainer } from 'containers/Organization';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { UserOrganizationsContainer } from 'containers/UserOrganizations';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router basename="/veriforce-linking">
          <Theme>
            {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
            <Route
              path="/:pecOrganizationId?"
              render={({
                location,
                match: {
                  params: { pecOrganizationId }
                }
              }) => (
                <RegisterInterceptors organizationId={pecOrganizationId}>
                  <HotJarWrapper>
                    <NavContainer
                      organizationId={pecOrganizationId}
                      title={t('veriforceIntegration.title', 'PEC Safety + Veriforce')}
                      location={location}
                    >
                      <GridContainer>
                        <Grid item xs={12}>
                          <img
                            src={logo}
                            alt={t('veriforceIntegration.logoAlt', 'Veriforce | PEC')}
                            style={{ width: 'auto', height: 60 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Paper>
                            <Switch>
                              <Route path="/:pecOrganizationId" component={OrganizationContainer} />
                              <Route path="/" component={UserOrganizationsContainer} />
                            </Switch>
                          </Paper>
                        </Grid>
                      </GridContainer>
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
