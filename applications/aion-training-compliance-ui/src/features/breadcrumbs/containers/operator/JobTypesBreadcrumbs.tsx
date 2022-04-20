import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchJobTypeIfNeeded } from 'features/operator/jobType/actions/fetchJobType';
import { fetchOperatorJobTypeTrainingRequirementIfNeeded } from 'features/operator/jobTypeTrainingRequirement/actions/fetchJobTypeTrainingRequirement';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  jobTypeId?: string;
  jobTypeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  jobType: { jobType, isFetching: isFetchingJobType },
  operatorJobTypeTrainingRequirement: {
    operatorJobTypeTrainingRequirement,
    isFetching: isFetchingOperatorJobTypeTrainingRequirement
  }
}: RootState) => ({
  isFetchingJobType,
  isFetchingOperatorJobTypeTrainingRequirement,
  jobType,
  operatorJobTypeTrainingRequirement
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { jobTypeId, jobTypeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypeIfNeeded: () => jobTypeId && dispatch(fetchJobTypeIfNeeded(jobTypeId)),
  fetchOperatorJobTypeTrainingRequirementIfNeeded: () =>
    jobTypeTrainingRequirementId &&
    dispatch(fetchOperatorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class JobTypesBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypeIfNeeded();
    props.fetchOperatorJobTypeTrainingRequirementIfNeeded();
  }

  render() {
    const {
      isFetchingJobType,
      isFetchingOperatorJobTypeTrainingRequirement,
      jobType,
      operatorJobTypeTrainingRequirement,
      location: { pathname },
      match: {
        params: { organizationId, jobTypeId, jobTypeTrainingRequirementId }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: { pathname: `/${organizationId}/training-compliance/job-types` },
        label: t('trainingCompliance.common.jobTypes', 'Job Types')
      }
    ];

    if (matchPath(pathname, '/:organizationId/training-compliance/job-types/add')) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/job-types/add` },
        label: t('trainingCompliance.common.newJobType', 'New Job Type')
      });
    }

    if (jobTypeId && !isFetchingJobType && jobType) {
      let link = {
        to: { pathname: `/${organizationId}/training-compliance/job-types/${jobTypeId}` },
        label: jobType.name
      };

      if (matchPath(pathname, '/:organizationId/training-compliance/job-types/:jobTypeId/training')) {
        link.to = { pathname: `/${organizationId}/training-compliance/job-types/${jobTypeId}/training` };
      }

      if (matchPath(pathname, '/:organizationId/training-compliance/job-types/:jobTypeId/general-info')) {
        link.to = { pathname: `/${organizationId}/training-compliance/job-types/${jobTypeId}/general-info` };
      }

      links.push(link);
    }

    if (
      jobTypeId &&
      !isFetchingJobType &&
      jobType &&
      matchPath(pathname, '/:organizationId/training-compliance/job-types/:jobTypeId/add')
    ) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/job-types/${jobTypeId}/add` },
        label: t('trainingCompliance.common.addTrainingRequirements', {
          name: jobType.name,
          defaultValue: 'Add Training Requirements to {{name}}'
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
          pathname: `/${organizationId}/training-compliance/job-types/${jobTypeId}/training/${jobTypeTrainingRequirementId}`
        },
        label: operatorJobTypeTrainingRequirement.trainingRequirementName
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const JobTypesBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(JobTypesBreadcrumbs))
);
