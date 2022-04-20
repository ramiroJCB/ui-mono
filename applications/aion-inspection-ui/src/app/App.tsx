import React from 'react';
import { baseTheme, Theme } from '@pec/aion-ui-components/components/Theme';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { Routes } from './Routes';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';

export const App: React.FC = () => {
  const { isSmallDown } = useScreenSize();
  let theme = isSmallDown
    ? createMuiTheme({ ...baseTheme, palette: { ...baseTheme.palette, background: { default: '#ffffff' } } })
    : createMuiTheme(baseTheme);

  theme = responsiveFontSizes(theme);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router basename="/organizations">
          <Theme themeOverride={theme}>
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
                      <NavContainer organizationId={organizationId} title="Performance Management" location={location}>
                        <Routes />
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
};
