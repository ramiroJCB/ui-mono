import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorEmployeeTrainingRequirementsComponent } from '../components/ContractorEmployeeTrainingRequirements';
import { fetchClientAssignedEmployeeTrainingRequirements } from 'features/operator/clientAssignedEmployeeTrainingRequirements/actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
  employeeId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => state.clientAssignedEmployeeTrainingRequirements;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId, employeeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorEmployeeTrainingRequirements: (top: number = 0, skip: number = 0) =>
    dispatch(fetchClientAssignedEmployeeTrainingRequirements(organizationId, employeeId, top, skip, parse(search).name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class ContractorEmployeesTrainingRequirements extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorEmployeeTrainingRequirements();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchContractorEmployeeTrainingRequirements,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchContractorEmployeeTrainingRequirements();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      isFetchingInitial,
      error,
      clientAssignedEmployeeTrainingRequirements,
      totalCount,
      location: { search },
      fetchContractorEmployeeTrainingRequirements
    } = this.props;
    return (
      <ContractorEmployeeTrainingRequirementsComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        employeeTrainingRequirements={clientAssignedEmployeeTrainingRequirements}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchContractorEmployeeTrainingRequirements={fetchContractorEmployeeTrainingRequirements}
      />
    );
  }
}

export const ContractorEmployeesTrainingRequirementsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractorEmployeesTrainingRequirements);
