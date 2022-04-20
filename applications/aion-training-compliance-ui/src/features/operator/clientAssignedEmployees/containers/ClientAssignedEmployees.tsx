import * as React from 'react';
import { ClientAssignedEmployeesComponent } from '../components/ClientAssignedEmployees';
import { connect } from 'react-redux';
import { fetchClientAssignedEmployees } from '../actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.clientAssignedEmployees;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientAssignedEmployees: (top: number = 0, skip: number = 0) =>
    dispatch(fetchClientAssignedEmployees(organizationId, top, skip, parse(search).name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class ClientAssignedEmployees extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientAssignedEmployees();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchClientAssignedEmployees,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchClientAssignedEmployees();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      clientAssignedEmployees,
      error,
      totalCount,
      fetchClientAssignedEmployees,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <ClientAssignedEmployeesComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        clientAssignedEmployees={clientAssignedEmployees}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchClientAssignedEmployees={fetchClientAssignedEmployees}
      />
    );
  }
}

export const ClientAssignedEmployeesContainer = withEnhancedRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientAssignedEmployees)
);
