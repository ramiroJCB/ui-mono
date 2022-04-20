import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeContractorGeneralInfoContainer } from 'features/operator/workGroupJobTypeContractor/containers/WorkGroupJobTypeContractorGeneralInfo';
import { WorkGroupJobTypeEmployeesContainer } from 'features/operator/workGroupJobTypeContractor/containers/WorkGroupJobTypeEmployees';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';

export const OperatorWorkGroupJobTypeContractorsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/contractors/:workGroupJobTypeContractorId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/general-info"
            component={WorkGroupJobTypeContractorGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId"
            component={WorkGroupJobTypeEmployeesContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
