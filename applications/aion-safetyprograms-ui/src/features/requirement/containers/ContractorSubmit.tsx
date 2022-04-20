import * as React from 'react';
import { connect } from 'react-redux';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { ThunkDispatch } from 'redux-thunk';
import { updateRequirement } from '../actions/updateRequirement';
import { ContractorSubmit } from '../components/ContractorSubmit';

type OwnProps = {
  safetyProgramRequirementId: string;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: RootState) => state.requirement;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { safetyProgramRequirementId }: OwnProps
) => ({
  updateRequirement: (status: SafetyProgramRequirementStatus) =>
    dispatch(updateRequirement(safetyProgramRequirementId, status))
});

class Component extends React.Component<Props> {
  handleClickSubmit = () => this.props.updateRequirement(SafetyProgramRequirementStatus.SubmittedComplete);

  render() {
    const { requirement } = this.props;

    return <ContractorSubmit requirement={requirement} handleClickSubmit={this.handleClickSubmit} />;
  }
}

export const ContractorSubmitContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
