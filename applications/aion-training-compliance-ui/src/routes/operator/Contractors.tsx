import * as React from 'react';
import { ContractorContainer } from 'features/operator/contractor/containers/Contractor';
import { ContractorEmployeesContainer } from 'features/operator/contractor/containers/ContractorEmployees';
import { ContractorsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/ContractorsBreadcrumbs';
import { ContractorsContainer } from 'features/operator/contractors/containers/Contractors';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';

export const OperatorContractorsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/contractors/:contractorId([^/]{36})?"
          component={ContractorsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/contractors/:contractorId/general-info"
            component={ContractorContainer}
          />
          <Route
            path="/:organizationId/training-compliance/contractors/:contractorId"
            component={ContractorEmployeesContainer}
          />
          <Route path="/:organizationId/training-compliance/contractors" component={ContractorsContainer} />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
