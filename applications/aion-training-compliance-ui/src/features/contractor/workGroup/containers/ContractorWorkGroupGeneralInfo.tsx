import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupContractorIfNeeded } from '../actions';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { ContractorWorkGroupGeneralInfoComponent } from '../components/ContractorWorkGroupGeneralInfo';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupContractor;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupContractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupContractorIfNeeded: () => dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ContractorWorkGroupGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupContractorIfNeeded();
  }

  render() {
    const { workGroupContractor, isFetching, error } = this.props;

    return (
      <ContractorWorkGroupGeneralInfoComponent
        isFetching={isFetching}
        error={error}
        workGroupContractor={workGroupContractor}
      />
    );
  }
}

export const ContractorWorkGroupGeneralInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractorWorkGroupGeneralInfo);
