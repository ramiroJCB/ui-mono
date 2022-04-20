import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeEmployeeContainer } from 'features/contractor/workGroupJobTypeEmployee/containers/WorkGroupJobTypeEmployee';
import { WorkGroupJobTypeEmployeeGeneralInfoContainer } from 'features/contractor/workGroupJobTypeEmployee/containers/WorkGroupJobTypeEmployeeGeneralInfo';
import { WorkGroupJobTypeEmployeesBreadcrumbsContainer } from 'features/breadcrumbs/containers/contractor/WorkGroupJobTypeEmployeesBreadcrumbs';

export const ContractorWorkGroupJobTypeEmployeesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId([^/]{36})?/work-groups/:workGroupContractorId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?/employees/:workGroupJobTypeEmployeeId([^/]{36})?"
          component={WorkGroupJobTypeEmployeesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId/general-info"
            component={WorkGroupJobTypeEmployeeGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId"
            component={WorkGroupJobTypeEmployeeContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
