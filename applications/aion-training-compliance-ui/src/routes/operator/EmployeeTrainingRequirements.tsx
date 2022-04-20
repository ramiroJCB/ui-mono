import * as React from 'react';
import { ClientAssignedEmployeesBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/ClientAssignedEmployeesBreadcrumbs';
import { EmployeeTrainingRequirementContainer } from 'features/operator/contractor/containers/EmployeeTrainingRequirement';
import { Route } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';

export const OperatorEmployeeTrainingRequirementsRoutes: React.FC = () => (
  <RouteTransition>
    {() => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/assigned-employees/:employeeId([^/]{36})?/training/:employeeTrainingRequirementId([^/]{36})?"
          component={ClientAssignedEmployeesBreadcrumbsContainer}
        />
        <Route
          path="/:organizationId/training-compliance/assigned-employees/:employeeId/training/:employeeTrainingRequirementId"
          component={EmployeeTrainingRequirementContainer}
        />
      </React.Fragment>
    )}
  </RouteTransition>
);
