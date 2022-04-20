import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { fetchContractorJobTypeTrainingRequirementIfNeeded } from 'features/contractor/jobTypeTrainingRequirement/actions';
import { fetchWorkGroupContractorIfNeeded } from 'features/contractor/workGroup/actions';
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
  jobTypeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  workGroupContractor: { workGroupContractor, isFetching: isFetchingWorkGroupContractor },
  workGroupJobType: { workGroupJobType, isFetching: isFetchingWorkGroupJobType },
  contractorJobTypeTrainingRequirement: {
    contractorJobTypeTrainingRequirement,
    isFetching: isFetchingContractorJobTypeTrainingRequirement
  },
  clients: { clients, isFetching: isFetchingClients }
}: RootState) => ({
  isFetchingClients,
  isFetchingWorkGroupContractor,
  isFetchingWorkGroupJobType,
  isFetchingContractorJobTypeTrainingRequirement,
  workGroupContractor,
  workGroupJobType,
  contractorJobTypeTrainingRequirement,
  clients
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupContractorId, workGroupJobTypeId, jobTypeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientsIfNeeded: () => dispatch(fetchClientsIfNeeded(organizationId, [TrainingCompliance])),
  fetchWorkGroupContractorIfNeeded: () =>
    workGroupContractorId && dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId)),
  fetchWorkGroupJobTypeIfNeeded: () =>
    workGroupJobTypeId && dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchContractorJobTypeTrainingRequirementIfNeeded: () =>
    jobTypeTrainingRequirementId &&
    dispatch(fetchContractorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class WorkGroupJobTypesBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientsIfNeeded();
    props.fetchWorkGroupContractorIfNeeded();
    props.fetchWorkGroupJobTypeIfNeeded();
    props.fetchContractorJobTypeTrainingRequirementIfNeeded();
  }

  render() {
    const {
      isFetchingClients,
      isFetchingWorkGroupContractor,
      isFetchingWorkGroupJobType,
      isFetchingContractorJobTypeTrainingRequirement,
      clients,
      workGroupContractor,
      workGroupJobType,
      contractorJobTypeTrainingRequirement,
      location: { pathname },
      match: {
        params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId, jobTypeTrainingRequirementId }
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
      let link = {
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}`
        },
        label: workGroupJobType.jobTypeName
      };

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/training'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/training`
        };
      }

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/general-info'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/general-info`
        };
      }

      links.push(link);
    }

    if (
      workGroupJobTypeId &&
      !isFetchingWorkGroupJobType &&
      workGroupJobType &&
      matchPath(
        pathname,
        '/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/job-types/:workGroupJobTypeId/add-employees'
      )
    ) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/add-employees`
        },
        label: t('trainingCompliance.common.addEmployees', {
          jobTypeName: workGroupJobType.jobTypeName,
          defaultValue: 'Add Employees to {{jobTypeName}}'
        })
      });
    }

    if (
      jobTypeTrainingRequirementId &&
      !isFetchingContractorJobTypeTrainingRequirement &&
      contractorJobTypeTrainingRequirement
    ) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/training/${jobTypeTrainingRequirementId}`
        },
        label: contractorJobTypeTrainingRequirement.trainingRequirementName
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const WorkGroupJobTypesBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(WorkGroupJobTypesBreadcrumbs))
);
