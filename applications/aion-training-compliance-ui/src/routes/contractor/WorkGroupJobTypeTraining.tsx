import * as React from 'react';
import { JobTypeTrainingRequirementContainer } from 'features/contractor/jobTypeTrainingRequirement/containers/JobTypeTrainingRequirement';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypesBreadcrumbsContainer } from 'features/breadcrumbs/containers/contractor/WorkGroupJobTypesBreadcrumbs';

export const ContractorWorkGroupJobTypeTrainingRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId([^/]{36})?/work-groups/:workGroupContractorId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/training/:jobTypeTrainingRequirementId([^/]{36})?"
          component={WorkGroupJobTypesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/training/:jobTypeTrainingRequirementId"
            component={JobTypeTrainingRequirementContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
