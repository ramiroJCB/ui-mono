import * as React from 'react';
import { AddWorkGroupJobTypeEmployeesContainer } from 'features/contractor/workGroupJobTypeEmployees/containers/AddWorkGroupJobTypeEmployees';
import { Route, Switch } from 'react-router-dom';
import { RouteTransition } from 'components/RouteTransition';
import { WorkGroupJobTypeEmployeesContainer } from 'features/contractor/workGroupJobType/containers/WorkGroupJobTypeEmployees';
import { WorkGroupJobTypeGeneralInfoContainer } from 'features/workGroupJobType/containers/WorkGroupJobTypeGeneralInfo';
import { WorkGroupJobTypesBreadcrumbsContainer } from 'features/breadcrumbs/containers/contractor/WorkGroupJobTypesBreadcrumbs';
import { WorkGroupJobTypeTrainingContainer } from 'features/contractor/workGroupJobType/containers/WorkGroupJobTypeTraining';

export const ContractorWorkGroupJobTypesRoutes: React.FC = () => (
  <RouteTransition>
    {location => (
      <React.Fragment>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId([^/]{36})?/work-groups/:workGroupContractorId([^/]{36})?/job-types/:workGroupJobTypeId([^/]{36})?"
          component={WorkGroupJobTypesBreadcrumbsContainer}
        />
        <Switch location={location}>
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/training"
            component={WorkGroupJobTypeTrainingContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/general-info"
            component={WorkGroupJobTypeGeneralInfoContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/add-employees"
            component={AddWorkGroupJobTypeEmployeesContainer}
          />
          <Route
            path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId"
            component={WorkGroupJobTypeEmployeesContainer}
          />
        </Switch>
      </React.Fragment>
    )}
  </RouteTransition>
);
