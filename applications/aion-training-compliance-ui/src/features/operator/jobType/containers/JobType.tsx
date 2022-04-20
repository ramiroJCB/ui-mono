import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchOperatorJobTypeTrainingRequirements } from '../../jobTypeTrainingRequirements/actions/fetchJobTypeTrainingRequirements';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { JobTypeComponent } from '../components/JobType';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  operatorJobTypeTrainingRequirements: {
    isFetchingInitial: isFetchingInitialTrainingRequirements,
    operatorJobTypeTrainingRequirements,
    totalCount,
    error: trainingRequirementsError
  }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialTrainingRequirements,
  operatorJobTypeTrainingRequirements,
  totalCount,
  userInfo,
  error: userInfoError || trainingRequirementsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { jobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOperatorJobTypeTrainingRequirements: (top: number = 0, skip: number = 0) =>
    dispatch(fetchOperatorJobTypeTrainingRequirements(jobTypeId, top, skip, parse(search).trainingRequirementName)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class JobType extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOperatorJobTypeTrainingRequirements();
    props.fetchUserInfoIfNeeded();
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

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchOperatorJobTypeTrainingRequirements,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchOperatorJobTypeTrainingRequirements();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('trainingRequirementName', searchText);

  render() {
    const {
      operatorJobTypeTrainingRequirements,
      fetchOperatorJobTypeTrainingRequirements,
      isFetching,
      error,
      totalCount,
      location: { search }
    } = this.props;

    return (
      <JobTypeComponent
        isFetching={isFetching}
        error={error}
        operatorJobTypeTrainingRequirements={operatorJobTypeTrainingRequirements}
        totalCount={totalCount}
        searchValue={parse(search).trainingRequirementName || ''}
        handleSearch={this.handleSearch}
        fetchOperatorJobTypeTrainingRequirements={fetchOperatorJobTypeTrainingRequirements}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const JobTypeContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(JobType)
);
