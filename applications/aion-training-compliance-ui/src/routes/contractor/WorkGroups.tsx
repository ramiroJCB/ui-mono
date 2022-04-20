import * as React from 'react';
import { ContractorWorkGroupGeneralInfoContainer } from 'features/contractor/workGroup/containers/ContractorWorkGroupGeneralInfo';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupContractorBreadcrumbsContainer } from 'features/breadcrumbs/containers/contractor/WorkGroupBreadcrumbs';
import { WorkGroupContractorsContainer } from 'features/contractor/workGroups/containers/WorkGroupContractors';
import { WorkGroupJobTypesContainer } from 'features/contractor/workGroup/containers/WorkGroupJobTypes';

export const ContractorWorkGroupsRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId([^/]{36})?/work-groups/:workGroupContractorId([^/]{36})?"
          component={WorkGroupContractorBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/general-info"
            component={ContractorWorkGroupGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId"
            component={WorkGroupJobTypesContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups"
            component={WorkGroupContractorsContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
