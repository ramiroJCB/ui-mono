import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error } from '@pec/aion-ui-components/components/Error';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { LinksSearch } from 'components/LinksSearch';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

export const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename="/links">
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
              <RegisterInterceptors>
                <NavContainer location={location} organizationId={organizationId} title="Admin">
                  <Switch>
                    <Route exact={true} path="/:organizationId?" component={LinksSearch} />
                    <Route component={Error} />
                  </Switch>
                  <Footer />
                </NavContainer>
              </RegisterInterceptors>
            )}
          />
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);
