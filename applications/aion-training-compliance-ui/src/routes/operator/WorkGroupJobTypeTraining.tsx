import * as React from 'react';
import { JobTypeTrainingRequirementContainer } from 'features/operator/jobTypeTrainingRequirement/containers/JobTypeTrainingRequirement';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';

export const OperatorWorkGroupJobTypeTrainingRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/training/:jobTypeTrainingRequirementId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/training/:jobTypeTrainingRequirementId"
            component={JobTypeTrainingRequirementContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
