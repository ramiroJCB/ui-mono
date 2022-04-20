import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorEmployeesComponent } from '../components/ContractorEmployees';
import { fetchContractorEmployees } from 'features/contractorEmployees/actions/contractorEmployees';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
  contractorId: string;
};

const mapStateToProps = (state: RootState) => state.contractorEmployees;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorEmployees: (top: number = 0, skip: number = 0) =>
    dispatch(fetchContractorEmployees(organizationId, contractorId, top, skip))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class ContractorEmployees extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorEmployees();
  }

  render() {
    const { contractorEmployees, error, totalCount, fetchContractorEmployees, isFetchingInitial } = this.props;

    return (
      <ContractorEmployeesComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        contractorEmployees={contractorEmployees}
        totalCount={totalCount}
        fetchContractorEmployees={fetchContractorEmployees}
      />
    );
  }
}

export const ContractorEmployeesContainer = connect(mapStateToProps, mapDispatchToProps)(ContractorEmployees);
