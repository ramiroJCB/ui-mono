import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { EvaluatorRequirementComponent } from '../components/EvaluatorRequirement';
import { fetchRequirement } from '../actions/fetchRequirement';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateOverride } from '../actions/updateRequirement';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, isFetching: isFetchingRequirement, error: requirementError },
    requirements: { search },
    userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError }
  }: RootState,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  requirement,
  isFetching: isFetchingRequirement || isFetchingUserInfo,
  error: requirementError || userInfoError,
  search,
  clientScoreOverride:
    requirement && requirement.clientScoreOverrides.find(({ clientId }) => clientId === organizationId),
  canChangeOverride: hasPermission(
    userInfo,
    ActivityAction.Write,
    ActivityResourceName.SafetyProgramRequirementClients,
    [
      {
        type: UserInfoActivitiesType.Organization,
        id: organizationId
      }
    ]
  ),
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRequirement: () => dispatch(fetchRequirement(safetyProgramRequirementId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded()),
  updateOverride: (overrideId: string, isOverridden: boolean) =>
    dispatch(updateOverride(overrideId, isOverridden, safetyProgramRequirementId))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.userInfo && props.fetchRequirement();
    props.fetchUserInfoIfNeeded();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { fetchRequirement, userInfo } = this.props;

    if (prevUserInfo === null && userInfo !== null) {
      fetchRequirement();
    }
  }

  handleChangeOverride = (_event: React.ChangeEvent, checked: boolean) => {
    const { clientScoreOverride, updateOverride } = this.props;

    if (clientScoreOverride) {
      updateOverride(clientScoreOverride.id, checked);
    }
  };

  render() {
    const {
      requirement,
      isFetching,
      error,
      search,
      clientScoreOverride,
      canChangeOverride,
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;

    return (
      <EvaluatorRequirementComponent
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        requirement={requirement}
        isFetching={isFetching}
        error={error}
        search={search}
        clientScoreOverride={clientScoreOverride}
        handleChangeOverride={canChangeOverride ? this.handleChangeOverride : undefined}
      />
    );
  }
}

export const ClientRequirementContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
