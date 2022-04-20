import * as React from 'react';
import { AddJobTypeContainer } from 'features/operator/jobType/containers/AddJobType';
import { AddJobTypeTrainingRequirementsContainer } from 'features/operator/jobTypeTrainingRequirements/containers/AddJobTypeTrainingRequirements';
import { JobTypeContainer } from 'features/operator/jobType/containers/JobType';
import { JobTypeGeneralInfoContainer } from 'features/operator/jobType/containers/JobTypeGeneralInfo';
import { JobTypesBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/JobTypesBreadcrumbs';
import { JobTypesContainer } from 'features/operator/jobTypes/containers/JobTypes';
import { JobTypeWorkGroupsContainer } from 'features/operator/jobType/containers/JobTypeWorkGroups';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';

export const OperatorJobTypesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/job-types/:jobTypeId([^/]{36})?"
          component={JobTypesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/job-types/:jobTypeId/general-info"
            component={JobTypeGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/job-types/:jobTypeId/add"
            component={AddJobTypeTrainingRequirementsContainer}
          />
          <Route path="/:organizationId/training-compliance/job-types/add" component={AddJobTypeContainer} />
          <Route
            path="/:organizationId/training-compliance/job-types/:jobTypeId/training"
            component={JobTypeContainer}
          />
          <Route
            path="/:organizationId/training-compliance/job-types/:jobTypeId"
            component={JobTypeWorkGroupsContainer}
          />
          <Route path="/:organizationId/training-compliance/job-types" component={JobTypesContainer} />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
