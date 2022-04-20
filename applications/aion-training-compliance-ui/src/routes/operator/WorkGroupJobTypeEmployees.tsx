import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeEmployeeTrainingContainer } from 'features/operator/workGroupJobTypeEmployee/containers/WorkGroupJobTypeEmployeeTrainingRequirements';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';

export const OperatorWorkGroupJobTypeEmployeesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/contractors/:workGroupJobTypeContractorId([^/]{36})?/employees/:workGroupJobTypeEmployeeId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/employees/:workGroupJobTypeEmployeeId"
            component={WorkGroupJobTypeEmployeeTrainingContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
