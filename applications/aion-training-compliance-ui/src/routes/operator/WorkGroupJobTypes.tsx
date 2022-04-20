import * as React from 'react';
import { AddWorkGroupJobTypeContractorsContainer } from 'features/operator/workGroupJobTypeContractors/containers/AddWorkGroupJobTypeContractors';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeContractorsContainer } from 'features/operator/workGroupJobType/containers/WorkGroupJobTypeContractors';
import { WorkGroupJobTypeGeneralInfoContainer } from 'features/workGroupJobType/containers/WorkGroupJobTypeGeneralInfo';
import { WorkGroupJobTypeTrainingContainer } from 'features/operator/workGroupJobType/containers/WorkGroupJobTypeTraining';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';

export const OperatorWorkGroupJobTypesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/add-contractors"
            component={AddWorkGroupJobTypeContractorsContainer}
          />
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/training"
            component={WorkGroupJobTypeTrainingContainer}
          />
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/general-info"
            component={WorkGroupJobTypeGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId"
            component={WorkGroupJobTypeContractorsContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
