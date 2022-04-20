import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeContractorIfNeeded } from 'features/operator/workGroupJobTypeContractor/actions/fetchWorkGroupJobTypeContractor';
import { fetchWorkGroupJobTypeEmployees } from 'features/workGroupJobTypeEmployees/actions/fetchWorkGroupJobTypeEmployees';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeEmployeesComponent } from '../components/WorkGroupJobTypeEmployees';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
};

const mapStateToProps = ({
  workGroupJobTypeContractor: {
    isFetching: isFetchingWorkGroupJobTypeContractor,
    workGroupJobTypeContractor,
    fetchError: fetchWorkGroupJobTypeContractorError
  },
  workGroupJobTypeEmployees: {
    isFetchingInitial: isFetchingInitialWorkGroupJobTypeEmployees,
    workGroupJobTypeEmployees,
    totalCount,
    error: workGroupJobTypeEmployeesError
  }
}: RootState) => ({
  isFetchingWorkGroupJobTypeContractor,
  isFetchingInitialWorkGroupJobTypeEmployees,
  workGroupJobTypeContractor,
  workGroupJobTypeEmployees,
  totalCount,
  error: workGroupJobTypeEmployeesError || fetchWorkGroupJobTypeContractorError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupJobTypeContractorId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeContractorIfNeeded: () =>
    dispatch(fetchWorkGroupJobTypeContractorIfNeeded(workGroupJobTypeContractorId)),
  fetchWorkGroupJobTypeEmployees: (contractorOrganizationId: string, workGroupJobTypeId: string) => (
    top: number = 0,
    skip: number = 0
  ) =>
    dispatch(
      fetchWorkGroupJobTypeEmployees(
        contractorOrganizationId,
        workGroupJobTypeId,
        top,
        skip,
        parse(search).employeeName
      )
    )
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeEmployees extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchWorkGroupJobTypeContractorData();
  }

  fetchWorkGroupJobTypeContractorData = async () => {
    const { contractorOrganizationId, workGroupJobTypeId } = await this.props.fetchWorkGroupJobTypeContractorIfNeeded();
    this.props.fetchWorkGroupJobTypeEmployees(contractorOrganizationId, workGroupJobTypeId)(0, 0);
  };

  componentDidUpdate({
    workGroupJobTypeContractor: prevWorkGroupJobTypeContractor,
    location: { search: prevSearch }
  }: Props) {
    const {
      workGroupJobTypeContractor,
      location: { search }
    } = this.props;

    if (prevSearch !== search || prevWorkGroupJobTypeContractor !== workGroupJobTypeContractor) {
      this.fetchWorkGroupJobTypeContractorData();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('employeeName', searchText);

  render() {
    const {
      workGroupJobTypeEmployees,
      workGroupJobTypeContractor,
      error,
      totalCount,
      fetchWorkGroupJobTypeEmployees,
      isFetchingInitialWorkGroupJobTypeEmployees,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeEmployeesComponent
        isFetchingInitial={isFetchingInitialWorkGroupJobTypeEmployees}
        error={error}
        workGroupJobTypeEmployees={workGroupJobTypeEmployees}
        totalCount={totalCount}
        searchValue={parse(search).employeeName || ''}
        handleSearch={this.handleSearch}
        workGroupJobTypeContractor={workGroupJobTypeContractor}
        fetchWorkGroupJobTypeEmployees={fetchWorkGroupJobTypeEmployees}
      />
    );
  }
}

export const WorkGroupJobTypeEmployeesContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeEmployees)
);
