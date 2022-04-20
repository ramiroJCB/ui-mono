import * as React from 'react';
import { Route } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';
import { EmployeeTrainingRequirementContainer } from 'features/operator/contractor/containers/EmployeeTrainingRequirement';

export const WorkGroupJobTypeEmployeeTrainingRequirementDetailsRoutes: React.FC = () => (
  <RouteTransition>
    {() => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/contractors/:workGroupJobTypeContractorId([^/]{36})?/employees/:workGroupJobTypeEmployeeId([^/]{36})?/training/:employeeTrainingRequirementId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/employees/:workGroupJobTypeEmployeeId/training/:employeeTrainingRequirementId"
          component={EmployeeTrainingRequirementContainer}
        />
      </React.Fragment>
    )}
  </RouteTransition>
);
