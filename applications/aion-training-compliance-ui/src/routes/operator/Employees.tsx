import * as React from 'react';
import { ClientAssignedEmployeesBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/ClientAssignedEmployeesBreadcrumbs';
import { ClientAssignedEmployeesContainer } from 'features/operator/clientAssignedEmployees/containers/ClientAssignedEmployees';
import { ClientAssignedEmployeeTrainingRequirementsContainer } from 'features/operator/clientAssignedEmployeeTrainingRequirements/containers/ClientAssignedEmployeeTrainingRequirements';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';

export const OperatorEmployeesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/assigned-employees/:employeeId([^/]{36})?"
          component={ClientAssignedEmployeesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/assigned-employees/:employeeId"
            component={ClientAssignedEmployeeTrainingRequirementsContainer}
          />
          <Route
            path="/:organizationId/training-compliance/assigned-employees"
            component={ClientAssignedEmployeesContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
