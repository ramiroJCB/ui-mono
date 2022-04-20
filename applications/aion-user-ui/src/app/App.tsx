import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { EditContactInfo } from 'features/profile/EditContactInfo';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Nav } from 'app/Nav';
import { Profile } from 'features/profile/Profile';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { store } from './store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

export const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename="/user">
        <Theme>
          {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
          <Route
            render={() => (
              <RegisterInterceptors>
                <Nav>
                  <Switch>
                    <Route exact path="/edit-contact-info" component={EditContactInfo} />
                    <Route path="/" component={Profile} />
                  </Switch>
                </Nav>
              </RegisterInterceptors>
            )}
          />
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);
