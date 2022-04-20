import * as React from 'react';
import { ContractorEmployeeAssignedBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/ContractorEmployeeAssignedBreadcrumbs';
import { Route } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { ContractorEmployeesTrainingRequirementsContainer } from 'features/operator/contractor/containers/ContractorEmployeeTrainingRequirements';

export const OperatorContractorTrainingRequirementsRoutes: React.FC = () => (
  <RouteTransition>
    {() => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/contractors/:contractorId([^/]{36})/assigned-employees/:employeeId([^/]{36})?"
          component={ContractorEmployeeAssignedBreadcrumbsContainer}
        />
        <Route
          path="/:organizationId/training-compliance/contractors/:contractorId/assigned-employees/:employeeId"
          component={ContractorEmployeesTrainingRequirementsContainer}
        />
      </React.Fragment>
    )}
  </RouteTransition>
);
