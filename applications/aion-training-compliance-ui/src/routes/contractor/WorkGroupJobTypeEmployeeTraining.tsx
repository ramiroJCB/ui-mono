import * as React from 'react';
import { EmployeeTrainingRequirementContainer } from 'features/contractor/employeeTrainingRequirement/containers/EmployeeTrainingRequirement';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeEmployeeTrainingBreadcrumbsContainer } from 'features/breadcrumbs/containers/contractor/WorkGroupJobTypeEmployeeTrainingBreadcrumbs';

export const ContractorWorkGroupJobTypeEmployeeTrainingRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId([^/]{36})?/work-groups/:workGroupContractorId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/employees/:workGroupJobTypeEmployeeId([^/]{36})?/training/:employeeTrainingRequirementId([^/]{36})?"
          component={WorkGroupJobTypeEmployeeTrainingBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId/training/:employeeTrainingRequirementId"
            component={EmployeeTrainingRequirementContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
