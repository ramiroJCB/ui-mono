import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchEmployeeTrainingRequirementIfNeeded } from 'features/contractor/employeeTrainingRequirement/actions/fetchEmployeeTrainingRequirement';
import { fetchOperatorJobTypeTrainingRequirementIfNeeded } from 'features/operator/jobTypeTrainingRequirement/actions/fetchJobTypeTrainingRequirement';
import { fetchWorkGroupIfNeeded } from 'features/operator/workGroup/actions/fetchWorkGroup';
import { fetchWorkGroupJobTypeContractorIfNeeded } from 'features/operator/workGroupJobTypeContractor/actions/fetchWorkGroupJobTypeContractor';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId?: string;
  workGroupJobTypeId?: string;
  jobTypeTrainingRequirementId?: string;
  workGroupJobTypeContractorId?: string;
  workGroupJobTypeEmployeeId?: string;
  employeeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  workGroup: { workGroup, isFetching: isFetchingWorkGroup },
  workGroupJobType: { workGroupJobType, isFetching: isFetchingWorkGroupJobType },
  operatorJobTypeTrainingRequirement: {
    operatorJobTypeTrainingRequirement,
    isFetching: isFetchingOperatorJobTypeTrainingRequirement
  },
  workGroupJobTypeContractor: { workGroupJobTypeContractor, isFetching: isFetchingWorkGroupJobTypeContractor },
  workGroupJobTypeEmployee: { workGroupJobTypeEmployee, isFetching: isFetchingWorkGroupJobTypeEmployee },
  employeeTrainingRequirement: { employeeTrainingRequirement, isFetching: isFetchingEmployeeTrainingRequirement }
}: RootState) => ({
  isFetchingWorkGroup,
  isFetchingWorkGroupJobType,
  isFetchingOperatorJobTypeTrainingRequirement,
  isFetchingWorkGroupJobTypeContractor,
  isFetchingWorkGroupJobTypeEmployee,
  isFetchingEmployeeTrainingRequirement,
  workGroup,
  workGroupJobType,
  operatorJobTypeTrainingRequirement,
  workGroupJobTypeContractor,
  workGroupJobTypeEmployee,
  employeeTrainingRequirement
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: {
        workGroupId,
        workGroupJobTypeId,
        jobTypeTrainingRequirementId,
        workGroupJobTypeContractorId,
        workGroupJobTypeEmployeeId,
        employeeTrainingRequirementId
      }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupIfNeeded: () => workGroupId && dispatch(fetchWorkGroupIfNeeded(workGroupId)),
  fetchWorkGroupJobTypeIfNeeded: () =>
    workGroupJobTypeId && dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchJobTypeTrainingRequirementIfNeeded: () =>
    jobTypeTrainingRequirementId &&
    dispatch(fetchOperatorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId)),
  fetchWorkGroupJobTypeContractorIfNeeded: () =>
    workGroupJobTypeContractorId && dispatch(fetchWorkGroupJobTypeContractorIfNeeded(workGroupJobTypeContractorId)),
  fetchWorkGroupJobTypeEmployeeIfNeeded: () =>
    workGroupJobTypeEmployeeId && dispatch(fetchWorkGroupJobTypeEmployeeIfNeeded(workGroupJobTypeEmployeeId)),
  fetchEmployeeTrainingRequirementIfNeeded: () =>
    employeeTrainingRequirementId && dispatch(fetchEmployeeTrainingRequirementIfNeeded(employeeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class WorkGroupsBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupIfNeeded();
    props.fetchWorkGroupJobTypeIfNeeded();
    props.fetchJobTypeTrainingRequirementIfNeeded();
    props.fetchWorkGroupJobTypeContractorIfNeeded();
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
    props.fetchEmployeeTrainingRequirementIfNeeded();
  }

  render() {
    const {
      isFetchingWorkGroup,
      isFetchingWorkGroupJobType,
      isFetchingOperatorJobTypeTrainingRequirement,
      isFetchingWorkGroupJobTypeContractor,
      isFetchingWorkGroupJobTypeEmployee,
      isFetchingEmployeeTrainingRequirement,
      workGroup,
      workGroupJobType,
      operatorJobTypeTrainingRequirement,
      workGroupJobTypeContractor,
      workGroupJobTypeEmployee,
      employeeTrainingRequirement,
      location: { pathname },
      match: {
        params: {
          organizationId,
          workGroupId,
          workGroupJobTypeId,
          jobTypeTrainingRequirementId,
          workGroupJobTypeContractorId,
          workGroupJobTypeEmployeeId,
          employeeTrainingRequirementId
        }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: { pathname: `/${organizationId}/training-compliance/work-groups` },
        label: t('trainingCompliance.common.workGroups', 'Work Groups')
      }
    ];

    if (matchPath(pathname, '/:organizationId/training-compliance/work-groups/add')) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/work-groups/add` },
        label: t('trainingCompliance.common.newWorkGroup', 'New Work Group')
      });
    }

    if (workGroupId && !isFetchingWorkGroup && workGroup) {
      let link = {
        to: { pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}` },
        label: workGroup.name
      };

      if (matchPath(pathname, '/:organizationId/training-compliance/work-groups/:workGroupId/general-info')) {
        link.to = { pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/general-info` };
      }

      links.push(link);
    }

    if (
      workGroupId &&
      !isFetchingWorkGroup &&
      workGroup &&
      matchPath(pathname, '/:organizationId/training-compliance/work-groups/:workGroupId/add-work-group-job-types')
    ) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/add-work-group-job-types` },
        label: t('trainingCompliance.common.addJobTypes', {
          name: workGroup.name,
          defaultValue: 'Add Job Types to {{name}}'
        })
      });
    }

    if (workGroupJobTypeId && !isFetchingWorkGroupJobType && workGroupJobType) {
      let link = {
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`
        },
        label: workGroupJobType.jobTypeName
      };

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/training'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/training`
        };
      }

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/general-info'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/general-info`
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
        '/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/add-contractors'
      )
    ) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/add-contractors`
        },
        label: t('trainingCompliance.common.addContractors', {
          jobTypeName: workGroupJobType.jobTypeName,
          defaultValue: 'Add Contractors to {{jobTypeName}}'
        })
      });
    }

    if (
      jobTypeTrainingRequirementId &&
      !isFetchingOperatorJobTypeTrainingRequirement &&
      operatorJobTypeTrainingRequirement
    ) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/training/${jobTypeTrainingRequirementId}`
        },
        label: operatorJobTypeTrainingRequirement.trainingRequirementName
      });
    }

    if (workGroupJobTypeContractorId && !isFetchingWorkGroupJobTypeContractor && workGroupJobTypeContractor) {
      let link = {
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}`
        },
        label: workGroupJobTypeContractor.contractorName
      };

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/work-groups/:workGroupId/job-types/:workGroupJobTypeId/contractors/:workGroupJobTypeContractorId/general-info'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/general-info`
        };
      }

      links.push(link);
    }

    if (workGroupJobTypeEmployeeId && !isFetchingWorkGroupJobTypeEmployee && workGroupJobTypeEmployee) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/employees/${workGroupJobTypeEmployeeId}`
        },
        label: workGroupJobTypeEmployee.employeeName
      });
    }

    if (employeeTrainingRequirementId && !isFetchingEmployeeTrainingRequirement && employeeTrainingRequirement) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/employees/${workGroupJobTypeEmployeeId}/training/${employeeTrainingRequirementId}`
        },
        label: employeeTrainingRequirement.trainingRequirement.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const WorkGroupsBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(WorkGroupsBreadcrumbs))
);
