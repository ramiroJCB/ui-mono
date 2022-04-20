import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorRequirementComponent } from '../components/ContractorRequirement';
import { fetchRequirement } from '../actions/fetchRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({ requirement, userInfo: { userInfo } }: RootState) => ({ requirement, userInfo });

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
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;
    const { requirement, isFetching, error } = this.props.requirement;

    return (
      <ContractorRequirementComponent
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        requirement={requirement}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const ContractorRequirementContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
