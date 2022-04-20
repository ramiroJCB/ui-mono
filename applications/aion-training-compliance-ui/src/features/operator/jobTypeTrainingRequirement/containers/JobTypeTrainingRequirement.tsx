import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { deleteJobTypeTrainingRequirement } from '../actions/deleteJobTypeTrainingRequirement';
import { fetchOperatorJobTypeTrainingRequirementIfNeeded } from '../actions/fetchJobTypeTrainingRequirement';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { JobTypeTrainingRequirementComponent } from '../components/JobTypeTrainingRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type RouteParams = {
  organizationId: string;
  jobTypeTrainingRequirementId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  operatorJobTypeTrainingRequirement: {
    operatorJobTypeTrainingRequirement,
    isFetching: isFetchingJobTypeTrainingRequirement,
    error: jobTypeTrainingRequirementError
  }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingJobTypeTrainingRequirement,
  operatorJobTypeTrainingRequirement,
  userInfo,
  error: userInfoError || jobTypeTrainingRequirementError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, jobTypeTrainingRequirementId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOperatorJobTypeTrainingRequirementIfNeeded: () =>
    dispatch(fetchOperatorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId)),
  deleteJobTypeTrainingRequirement: (jobTypeId: string) => () =>
    dispatch(deleteJobTypeTrainingRequirement(history, organizationId, jobTypeId, jobTypeTrainingRequirementId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class JobTypeTrainingRequirement extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOperatorJobTypeTrainingRequirementIfNeeded();
    props.fetchUserInfoIfNeeded();
    this.redirectIfDeleted();
  }

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  hasGlobalPermission = (action: ActivityAction, resourceName: ActivityResourceName) =>
    hasPermission(this.props.userInfo, action, resourceName);

  hasOrganizationPermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    const {
      userInfo,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return organizationId
      ? hasPermission(userInfo, action, resourceName, [
          {
            type: UserInfoActivitiesType.Organization,
            id: organizationId
          }
        ])
      : false;
  };

  redirectIfDeleted() {
    const {
      operatorJobTypeTrainingRequirement,
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (operatorJobTypeTrainingRequirement && operatorJobTypeTrainingRequirement.isDeleted) {
      history.replace(
        `/${organizationId}/training-compliance/job-types/${operatorJobTypeTrainingRequirement.jobTypeId}`
      );
    }
  }

  render() {
    const { operatorJobTypeTrainingRequirement, isFetching, error, deleteJobTypeTrainingRequirement } = this.props;

    return (
      <JobTypeTrainingRequirementComponent
        isFetching={isFetching}
        error={error}
        operatorJobTypeTrainingRequirement={operatorJobTypeTrainingRequirement}
        deleteJobTypeTrainingRequirement={deleteJobTypeTrainingRequirement}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const JobTypeTrainingRequirementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobTypeTrainingRequirement);
