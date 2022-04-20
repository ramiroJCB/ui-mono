import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { fetchEmployeeTrainingRequirementIfNeeded } from 'features/contractor/employeeTrainingRequirement/actions/fetchEmployeeTrainingRequirement';
import { fetchWorkGroupContractorIfNeeded } from 'features/contractor/workGroup/actions';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const { TrainingCompliance } = OrganizationFeature;

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId?: string;
  workGroupJobTypeId?: string;
  workGroupJobTypeEmployeeId?: string;
  employeeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  workGroupContractor: { workGroupContractor, isFetching: isFetchingWorkGroupContractor },
  workGroupJobType: { workGroupJobType, isFetching: isFetchingWorkGroupJobType },
  employeeTrainingRequirement: { employeeTrainingRequirement, isFetching: isFetchingEmployeeTrainingRequirement },
  workGroupJobTypeEmployee: { workGroupJobTypeEmployee, isFetching: isFetchingWorkGroupJobTypeEmployee },
  clients: { clients, isFetching: isFetchingClients }
}: RootState) => ({
  isFetchingClients,
  isFetchingWorkGroupContractor,
  isFetchingWorkGroupJobType,
  isFetchingEmployeeTrainingRequirement,
  isFetchingWorkGroupJobTypeEmployee,
  workGroupContractor,
  workGroupJobType,
  employeeTrainingRequirement,
  workGroupJobTypeEmployee,
  clients
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: {
        organizationId,
        workGroupContractorId,
        workGroupJobTypeId,
        workGroupJobTypeEmployeeId,
        employeeTrainingRequirementId
      }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchworkGroupContractorIfNeeded: () =>
    workGroupContractorId && dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId)),
  fetchClientsIfNeeded: () => dispatch(fetchClientsIfNeeded(organizationId, [TrainingCompliance])),
  fetchWorkGroupJobTypeIfNeeded: () =>
    workGroupJobTypeId && dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchEmployeeTrainingRequirementIfNeeded: () =>
    employeeTrainingRequirementId && dispatch(fetchEmployeeTrainingRequirementIfNeeded(employeeTrainingRequirementId)),
  fetchWorkGroupJobTypeEmployeeIfNeeded: () =>
    workGroupJobTypeEmployeeId && dispatch(fetchWorkGroupJobTypeEmployeeIfNeeded(workGroupJobTypeEmployeeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class WorkGroupJobTypeEmployeeTrainingBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchworkGroupContractorIfNeeded();
    props.fetchClientsIfNeeded();
    props.fetchEmployeeTrainingRequirementIfNeeded();
    props.fetchWorkGroupJobTypeIfNeeded();
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
  }

  render() {
    const {
      isFetchingClients,
      isFetchingWorkGroupContractor,
      isFetchingWorkGroupJobType,
      isFetchingWorkGroupJobTypeEmployee,
      isFetchingEmployeeTrainingRequirement,
      clients,
      workGroupContractor,
      workGroupJobType,
      workGroupJobTypeEmployee,
      employeeTrainingRequirement,
      match: {
        params: {
          organizationId,
          clientId,
          workGroupContractorId,
          workGroupJobTypeId,
          workGroupJobTypeEmployeeId,
          employeeTrainingRequirementId
        }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [];

    clients && !isFetchingClients && clients.length > 1
      ? links.push(
          {
            to: { pathname: `/${organizationId}/training-compliance/clients` },
            label: t('trainingCompliance.common.selectOperator', 'Select Operator')
          },
          {
            to: { pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups` },
            label: t('trainingCompliance.common.workGroups', 'Work Groups')
          }
        )
      : links.push({
          to: { pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups` },
          label: t('trainingCompliance.common.workGroups', 'Work Groups')
        });

    if (workGroupContractorId && !isFetchingWorkGroupContractor && workGroupContractor) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}`
        },
        label: workGroupContractor.workGroupName
      });
    }

    if (workGroupJobTypeId && !isFetchingWorkGroupJobType && workGroupJobType) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}`
        },
        label: workGroupJobType.jobTypeName
      });
    }

    if (workGroupJobTypeEmployeeId && !isFetchingWorkGroupJobTypeEmployee && workGroupJobTypeEmployee) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}`
        },
        label: workGroupJobTypeEmployee.employeeName
      });
    }

    if (employeeTrainingRequirementId && !isFetchingEmployeeTrainingRequirement && employeeTrainingRequirement) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}/training/${employeeTrainingRequirementId}`
        },
        label: employeeTrainingRequirement.trainingRequirement.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const WorkGroupJobTypeEmployeeTrainingBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(WorkGroupJobTypeEmployeeTrainingBreadcrumbs))
);
