import * as React from 'react';
import { AddWorkGroupContainer } from 'features/operator/workGroup/containers/AddWorkGroup';
import { AddWorkGroupJobTypeContainer } from 'features/operator/workGroupJobTypes/containers/AddWorkGroupJobTypes';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupContainer } from 'features/operator/workGroup/containers/WorkGroup';
import { WorkGroupGeneralInfoContainer } from 'features/operator/workGroup/containers/WorkGroupGeneralInfo';
import { WorkGroupsBreadcrumbsContainer } from 'features/breadcrumbs/containers/operator/WorkGroupsBreadcrumbs';
import { WorkGroupsContainer } from 'features/operator/workGroups/containers/WorkGroups';

export const OperatorWorkGroupsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId([^/]{36})?"
          component={WorkGroupsBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/add-work-group-job-types"
            component={AddWorkGroupJobTypeContainer}
          />
          <Route
            path="/:organizationId/training-compliance/work-groups/:workGroupId/general-info"
            component={WorkGroupGeneralInfoContainer}
          />
          <Route path="/:organizationId/training-compliance/work-groups/add" component={AddWorkGroupContainer} />
          <Route path="/:organizationId/training-compliance/work-groups/:workGroupId" component={WorkGroupContainer} />
          <Route path="/:organizationId/training-compliance/work-groups" component={WorkGroupsContainer} />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
