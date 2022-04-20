import * as React from 'react';
import { AssignedEmployeeReportContainer } from 'features/operator/assignedEmployeeReport/containers/AssignedEmployeeReport';
import { connect } from 'react-redux';
import { ContractorWorkGroupJobTypeEmployeesRoutes } from './contractor/WorkGroupJobTypeEmployees';
import { ContractorWorkGroupJobTypeEmployeeTrainingRoutes } from './contractor/WorkGroupJobTypeEmployeeTraining';
import { ContractorWorkGroupJobTypesRoutes } from './contractor/WorkGroupJobTypes';
import { ContractorWorkGroupJobTypeTrainingRoutes } from './contractor/WorkGroupJobTypeTraining';
import { ContractorWorkGroupsRoutes } from './contractor/WorkGroups';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { OperatorContractorEmployeeTrainingRequirementsInfoRoutes } from './operator/ContractorEmployeeTrainingRequirementsInfo';
import { OperatorContractorsRoutes } from './operator/Contractors';
import { OperatorContractorTrainingRequirementsRoutes } from './operator/ContractorAssignedEmployeeTrainingRequirements';
import { OperatorEmployeesRoutes } from './operator/Employees';
import { OperatorEmployeeTrainingRequirementsRoutes } from './operator/EmployeeTrainingRequirements';
import { OperatorJobTypesRoutes } from './operator/JobTypes';
import { OperatorJobTypeTrainingRequirementsRoutes } from './operator/JobTypeTrainingRequirements';
import { OperatorTrainingRequirementsRoutes } from './operator/TrainingRequirements';
import { OperatorWorkGroupJobTypeContractorsRoutes } from './operator/WorkGroupJobTypeContractors';
import { OperatorWorkGroupJobTypeEmployeesRoutes } from './operator/WorkGroupJobTypeEmployees';
import { OperatorWorkGroupJobTypesRoutes } from './operator/WorkGroupJobTypes';
import { OperatorWorkGroupJobTypeTrainingRoutes } from './operator/WorkGroupJobTypeTraining';
import { OperatorWorkGroupsRoutes } from './operator/WorkGroups';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { RedirectOrSelectClientContainer } from 'features/contractor/redirectOrSelectClient/containers/RedirectOrSelectClient';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { WorkGroupJobTypeEmployeeTrainingRequirementDetailsRoutes } from './operator/WorkGroupJobTypeTrainingRequirementDetails';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.organization;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Routes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
  }

  render() {
    const {
      match: {
        params: { organizationId }
      },
      organization
    } = this.props;
    const { Client, Subscriber } = OrganizationFeature;

    return organization && organization.features.includes(Client) ? (
      <Switch>
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/employees/:workGroupJobTypeEmployeeId/training/:employeeTrainingRequirementId"
          component={WorkGroupJobTypeEmployeeTrainingRequirementDetailsRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/employees/:workGroupJobTypeEmployeeId"
          component={OperatorWorkGroupJobTypeEmployeesRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId"
          component={OperatorWorkGroupJobTypeContractorsRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupjobTypeId/training/:jobTypeTrainingRequirementId"
          component={OperatorWorkGroupJobTypeTrainingRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId"
          component={OperatorWorkGroupJobTypesRoutes}
        />
        <Route path="/:organizationId/training-compliance/work-groups" component={OperatorWorkGroupsRoutes} />
        <Route
          path="/:organizationId/training-compliance/job-types/:jobTypeId/training/:jobTypeTrainingRequirementId"
          component={OperatorJobTypeTrainingRequirementsRoutes}
        />
        <Route path="/:organizationId/training-compliance/job-types" component={OperatorJobTypesRoutes} />
        <Route
          path="/:organizationId/training-compliance/contractors/:contractorId/assigned-employees/:employeeId/training/:employeeTrainingRequirementId"
          component={OperatorContractorEmployeeTrainingRequirementsInfoRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/contractors/:contractorId/assigned-employees/:employeeId"
          component={OperatorContractorTrainingRequirementsRoutes}
        />
        <Route path="/:organizationId/training-compliance/contractors" component={OperatorContractorsRoutes} />
        <Route path="/:organizationId/training-compliance/training" component={OperatorTrainingRequirementsRoutes} />
        <Route
          path="/:organizationId/training-compliance/assigned-employees/:employeeId/training/:employeeTrainingRequirementId"
          component={OperatorEmployeeTrainingRequirementsRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/assigned-employees-report"
          component={AssignedEmployeeReportContainer}
        />
        <Route path="/:organizationId/training-compliance/assigned-employees" component={OperatorEmployeesRoutes} />
        <Redirect
          exact
          from="/:organizationId/training-compliance"
          to={`/${organizationId}/training-compliance/work-groups`}
        />
      </Switch>
    ) : organization && organization.features.includes(Subscriber) ? (
      <Switch>
        <Route
          path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId/training/:employeeTrainingRequirementId"
          component={ContractorWorkGroupJobTypeEmployeeTrainingRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId"
          component={ContractorWorkGroupJobTypeEmployeesRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupId/job-types/:workGroupJobTypeId/training/:jobTypeTrainingRequirementId"
          component={ContractorWorkGroupJobTypeTrainingRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupId/job-types/:workGroupJobTypeId"
          component={ContractorWorkGroupJobTypesRoutes}
        />
        <Route
          path="/:organizationId/training-compliance/clients/:clientId/work-groups"
          component={ContractorWorkGroupsRoutes}
        />
        <Route path="/:organizationId/training-compliance/clients" component={RedirectOrSelectClientContainer} />
        <Redirect
          exact
          from="/:organizationId/training-compliance"
          to={`/${organizationId}/training-compliance/clients`}
        />
      </Switch>
    ) : null;
  }
}

export const RoutesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
