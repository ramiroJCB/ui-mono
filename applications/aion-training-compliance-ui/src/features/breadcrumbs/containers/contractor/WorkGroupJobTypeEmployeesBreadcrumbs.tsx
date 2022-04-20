import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { fetchContractorJobTypeTrainingRequirementIfNeeded } from 'features/contractor/jobTypeTrainingRequirement/actions';
import { fetchWorkGroupContractorIfNeeded } from 'features/contractor/workGroup/actions';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
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
  jobTypeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  workGroupContractor: { workGroupContractor, isFetching: isFetchingWorkGroupContractor },
  workGroupJobType: { workGroupJobType, isFetching: isFetchingWorkGroupJobType },
  contractorJobTypeTrainingRequirement: {
    contractorJobTypeTrainingRequirement,
    isFetching: isFetchingContractorJobTypeTrainingRequirement
  },
  workGroupJobTypeEmployee: { workGroupJobTypeEmployee, isFetching: isFetchingWorkGroupJobTypeEmployee },
  clients: { clients, isFetching: isFetchingClients }
}: RootState) => ({
  isFetchingClients,
  isFetchingWorkGroupContractor,
  isFetchingWorkGroupJobType,
  isFetchingContractorJobTypeTrainingRequirement,
  isFetchingWorkGroupJobTypeEmployee,
  workGroupContractor,
  workGroupJobType,
  contractorJobTypeTrainingRequirement,
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
        jobTypeTrainingRequirementId
      }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientsIfNeeded: () => dispatch(fetchClientsIfNeeded(organizationId, [TrainingCompliance])),
  fetchworkGroupContractorIfNeeded: () =>
    workGroupContractorId && dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId)),
  fetchWorkGroupJobTypeIfNeeded: () =>
    workGroupJobTypeId && dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchWorkGroupJobTypeEmployeeIfNeeded: () =>
    workGroupJobTypeEmployeeId && dispatch(fetchWorkGroupJobTypeEmployeeIfNeeded(workGroupJobTypeEmployeeId)),
  fetchContractorJobTypeTrainingRequirementIfNeeded: () =>
    jobTypeTrainingRequirementId &&
    dispatch(fetchContractorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class WorkGroupJobTypeEmployeesBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientsIfNeeded();
    props.fetchworkGroupContractorIfNeeded();
    props.fetchWorkGroupJobTypeIfNeeded();
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
    props.fetchContractorJobTypeTrainingRequirementIfNeeded();
  }

  render() {
    const {
      isFetchingClients,
      isFetchingWorkGroupContractor,
      isFetchingWorkGroupJobType,
      isFetchingWorkGroupJobTypeEmployee,
      isFetchingContractorJobTypeTrainingRequirement,
      clients,
      workGroupContractor,
      workGroupJobType,
      contractorJobTypeTrainingRequirement,
      workGroupJobTypeEmployee,
      location: { pathname },
      match: {
        params: {
          organizationId,
          clientId,
          workGroupContractorId,
          workGroupJobTypeId,
          workGroupJobTypeEmployeeId,
          jobTypeTrainingRequirementId
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
      let link = {
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}`
        },
        label: workGroupJobTypeEmployee.employeeName
      };

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/employees/:workGroupJobTypeEmployeeId/general-info'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}/general-info`
        };
      }

      links.push(link);
    }

    if (
      jobTypeTrainingRequirementId &&
      !isFetchingContractorJobTypeTrainingRequirement &&
      contractorJobTypeTrainingRequirement
    ) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}/training/${jobTypeTrainingRequirementId}`
        },
        label: contractorJobTypeTrainingRequirement.trainingRequirementName
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const WorkGroupJobTypeEmployeesBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(WorkGroupJobTypeEmployeesBreadcrumbs))
);
