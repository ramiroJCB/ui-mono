import * as React from 'react';
import { JobTypesBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/JobTypesBreadcrumbs';
import { JobTypeTrainingRequirementContainer } from 'features/operator/jobTypeTrainingRequirement/containers/JobTypeTrainingRequirement';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';

export const OperatorJobTypeTrainingRequirementsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/job-types/:jobTypeId([^/]{36})?/training/:jobTypeTrainingRequirementId([^/]{36})?"
          component={JobTypesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/job-types/:jobTypeId/training/:jobTypeTrainingRequirementId"
            component={JobTypeTrainingRequirementContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
