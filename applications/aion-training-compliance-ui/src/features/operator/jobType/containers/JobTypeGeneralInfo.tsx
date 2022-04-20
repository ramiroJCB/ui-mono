import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { deleteJobType } from '../actions/deleteJobType';
import { editJobType } from '../actions/editJobType';
import { fetchJobTypeIfNeeded } from '../actions/fetchJobType';
import { fetchJobTypesForValidation } from 'features/operator/jobTypes/actions';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { FormApi } from 'final-form';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { JobTypeGeneralInfoComponent } from '../components/JobTypeGeneralInfo';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  jobType: { jobType, isFetching: isFetchingJobType, error: jobTypeError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingJobType,
  jobType,
  userInfo,
  error: userInfoError || jobTypeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, jobTypeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypeIfNeeded: () => dispatch(fetchJobTypeIfNeeded(jobTypeId)),
  fetchJobTypesForValidation: (name: string) => dispatch(fetchJobTypesForValidation(organizationId, name)),
  editJobType: (values: IJobType) => dispatch(editJobType(jobTypeId, values)),
  deleteJobType: (jobTypeId: string) => () => dispatch(deleteJobType(history, organizationId, jobTypeId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class JobTypeGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypeIfNeeded();
    props.fetchUserInfoIfNeeded();
  }

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  redirectIfDeleted() {
    const {
      jobType,
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (jobType && jobType.isDeleted) {
      history.replace(`/${organizationId}/training-compliance/job-types`);
    }
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

  onSubmit = async (values: IJobType, form: FormApi<IJobType>) => {
    await this.props.editJobType(values);
    form.reset();
  };

  render() {
    const { jobType, isFetching, error, fetchJobTypesForValidation, deleteJobType } = this.props;

    return (
      <JobTypeGeneralInfoComponent
        isFetching={isFetching}
        error={error}
        jobType={jobType}
        onSubmit={this.onSubmit}
        deleteJobType={deleteJobType}
        fetchJobTypesForValidation={fetchJobTypesForValidation}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const JobTypeGeneralInfoContainer = connect(mapStateToProps, mapDispatchToProps)(JobTypeGeneralInfo);
