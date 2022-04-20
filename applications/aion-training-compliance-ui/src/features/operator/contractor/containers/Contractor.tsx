import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorComponent } from '../components/Contractor';
import { fetchContractorIfNeeded } from '../actions';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  contractorId: string;
};

const mapStateToProps = (state: RootState) => state.contractor;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorIfNeeded: () => dispatch(fetchContractorIfNeeded(contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Contractor extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorIfNeeded();
  }

  render() {
    const { contractor, isFetching, error } = this.props;
    return <ContractorComponent isFetching={isFetching} error={error} contractor={contractor} />;
  }
}

export const ContractorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Contractor);
