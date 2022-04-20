import * as React from 'react';
import { connect } from 'react-redux';
import { EvaluatorRequirementComponent } from '../components/EvaluatorRequirement';
import { fetchRequirement } from '../actions/fetchRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId?: string;
  safetyProgramRequirementId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({ requirement, requirements: { search }, userInfo: { userInfo } }: RootState) => ({
  ...requirement,
  search,
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
  fetchRequirement: () => dispatch(fetchRequirement(safetyProgramRequirementId))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.userInfo && props.fetchRequirement();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { fetchRequirement, userInfo } = this.props;

    if (prevUserInfo === null && userInfo !== null) {
      fetchRequirement();
    }
  }

  render() {
    const {
      requirement,
      isFetching,
      error,
      search,
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
      />
    );
  }
}

export const EvaluatorRequirementContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
