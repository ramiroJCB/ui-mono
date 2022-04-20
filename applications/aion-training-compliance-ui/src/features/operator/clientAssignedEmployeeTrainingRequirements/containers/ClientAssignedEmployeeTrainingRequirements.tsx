import * as React from 'react';
import { connect } from 'react-redux';
import { ClientAssignedEmployeeTrainingRequirementsComponent } from '../components/ClientAssignedEmployeeTrainingRequirements';
import { fetchClientAssignedEmployeeTrainingRequirements } from '../actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
  employeeId: string;
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
  fetchClientAssignedEmployeeTrainingRequirements: (top: number = 0, skip: number = 0) =>
    dispatch(fetchClientAssignedEmployeeTrainingRequirements(organizationId, employeeId, top, skip, parse(search).name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class ClientAssignedEmployeeTrainingRequirements extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientAssignedEmployeeTrainingRequirements();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchClientAssignedEmployeeTrainingRequirements,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchClientAssignedEmployeeTrainingRequirements();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      clientAssignedEmployeeTrainingRequirements,
      error,
      totalCount,
      fetchClientAssignedEmployeeTrainingRequirements,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <ClientAssignedEmployeeTrainingRequirementsComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        clientAssignedEmployeeTrainingRequirements={clientAssignedEmployeeTrainingRequirements}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchClientAssignedEmployeeTrainingRequirements={fetchClientAssignedEmployeeTrainingRequirements}
      />
    );
  }
}

export const ClientAssignedEmployeeTrainingRequirementsContainer = withEnhancedRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientAssignedEmployeeTrainingRequirements)
);
