import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { Routes } from '../routes';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

export const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename={process.env.REACT_APP_BASENAME}>
        <Theme>
          <SnackbarProvider
            maxSnack={2}
            preventDuplicate
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <>
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
                    <NavContainer organizationId={organizationId} title="Scoring" location={location}>
                      <GridContainer style={{ position: 'relative' }}>
                        <Routes />
                      </GridContainer>
                      <Footer />
                    </NavContainer>
                  </RegisterInterceptors>
                )}
              />
            </>
          </SnackbarProvider>
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);
