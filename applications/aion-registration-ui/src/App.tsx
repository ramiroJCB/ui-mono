import * as React from 'react';
import CheckPermission from './containers/CheckPermission';
import EnterYourInfoContainer from './containers/EnterYourInfo';
import IdentifyTraineeContainer from './containers/IdentifyTrainee';
import OrganizationsResults from './containers/OrganizationsResults';
import Registration from './components/Registration';
import SearchOrganizations from './components/SearchOrganizations';
import UsingACompany from './components/UsingACompany';
import VerifyTraineeInfoContainer from './containers/VerifyTraineeInfo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error } from '@pec/aion-ui-components/components/Error';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { store } from './store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router basename="/registration">
        <Theme>
          {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
          <Route
            render={() => (
              <RegisterInterceptors>
                <CheckPermission>
                  <Switch>
                    <Route path="/enter-pec-id" component={IdentifyTraineeContainer} />
                    <Route path="/using-a-company" component={UsingACompany} />
                    <Route path="/companies/:companyId/enter-your-info" component={EnterYourInfoContainer} />
                    <Route path="/companies/search/:searchTerm" component={OrganizationsResults} />
                    <Route path="/companies" component={SearchOrganizations} />
                    <Route path="/trainees/:traineeId" component={VerifyTraineeInfoContainer} />
                    <Route path="/" component={Registration} />
                    <Route component={Error} />
                  </Switch>
                </CheckPermission>
              </RegisterInterceptors>
            )}
          />
        </Theme>
      </Router>
    </Provider>
  </ErrorBoundary>
);

export default App;
