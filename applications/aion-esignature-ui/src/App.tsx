import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AddEnvelopeContainer } from 'features/envelope/add/containers/AddEnvelope';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ClientEnvelopesContainer } from 'features/envelopes/containers/ClientEnvelopes';
import { ContractorEnvelopesContainer } from 'features/envelopes/containers/ContractorEnvelopes';
import { EnvelopeContainer } from 'features/envelope/view/containers/Envelope';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { OrganizationFeatureSwitch } from '@pec/aion-ui-components/containers/OrganizationFeatureSwitch';
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
            vertical: 'top',
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
                      <HotJarWrapper>
                        <NavContainer
                          organizationId={organizationId}
                          title={t('eSignature.common.eSignatures', 'eSignatures')}
                          location={location}
                        >
                          <GridContainer>
                            <Grid item xs={12}>
                              <Switch>
                                <Route
                                  path="/:organizationId/esignatures/documents/add"
                                  component={AddEnvelopeContainer}
                                />
                                <Route
                                  path="/:organizationId/esignatures/documents/:envelopeId"
                                  component={EnvelopeContainer}
                                />
                                <Route
                                  path="/:organizationId/esignatures/documents"
                                  render={props => (
                                    <OrganizationFeatureSwitch
                                      clientComponent={ClientEnvelopesContainer}
                                      subscriberComponent={ContractorEnvelopesContainer}
                                      {...props}
                                    />
                                  )}
                                />
                                <Redirect from="/:organizationId" to="/:organizationId/esignatures/documents" />
                              </Switch>
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
          </React.Fragment>
        </SnackbarProvider>
      </Provider>
    </ErrorBoundary>
  );
};
