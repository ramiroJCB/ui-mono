import * as React from 'react';
import { connect } from 'react-redux';
import { fetchContractorWorkGroupJobTypes } from 'features/contractor/workGroupJobTypes/actions';
import { fetchWorkGroupContractorIfNeeded } from '../actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypesComponent } from '../components/WorkGroupJobTypes';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
};

const mapStateToProps = ({
  contractorWorkGroupJobTypes: {
    isFetchingInitial: isFetchingInitialWorkGroupJobTypes,
    contractorWorkGroupJobTypes,
    totalCount,
    error: contractorWorkGroupJobTypesError
  },
  workGroupContractor: {
    isFetching: isFetchingWorkGroupContractor,
    workGroupContractor,
    error: workGroupContractorError
  }
}: RootState) => ({
  isFetchingWorkGroupContractor,
  isFetchingInitialWorkGroupJobTypes,
  workGroupContractor,
  contractorWorkGroupJobTypes,
  totalCount,
  error: contractorWorkGroupJobTypesError || workGroupContractorError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { workGroupContractorId, organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupContractorIfNeeded: () => dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId)),
  fetchWorkGroupJobTypes: (workGroupId: string) => (top: number = 0, skip: number = 0) =>
    dispatch(fetchContractorWorkGroupJobTypes(workGroupId, organizationId, top, skip, parse(search).jobTypeName))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchWorkGroupJobTypeData();
  }

  fetchWorkGroupJobTypeData = async () => {
    const { fetchWorkGroupContractorIfNeeded, fetchWorkGroupJobTypes } = this.props;
    const workGroupContractor = await fetchWorkGroupContractorIfNeeded();

    if (workGroupContractor) {
      const { workGroupId } = workGroupContractor;
      fetchWorkGroupJobTypes(workGroupId)(0, 0);
    }
  };

  componentDidUpdate({ workGroupContractor: prevWorkGroupContractor, location: { search: prevSearch } }: Props) {
    const {
      workGroupContractor,
      location: { search }
    } = this.props;

    if (prevSearch !== search || prevWorkGroupContractor !== workGroupContractor) {
      this.fetchWorkGroupJobTypeData();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('jobTypeName', searchText);

  render() {
    const {
      contractorWorkGroupJobTypes,
      error,
      totalCount,
      workGroupContractor,
      fetchWorkGroupJobTypes,
      isFetchingInitialWorkGroupJobTypes,
      isFetchingWorkGroupContractor,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypesComponent
        isFetchingInitial={isFetchingInitialWorkGroupJobTypes}
        isFetchingWorkGroupContractor={isFetchingWorkGroupContractor}
        error={error}
        workGroupContractor={workGroupContractor}
        contractorWorkGroupJobTypes={contractorWorkGroupJobTypes}
        totalCount={totalCount}
        searchValue={parse(search).jobTypeName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypes={fetchWorkGroupJobTypes}
      />
    );
  }
}

export const WorkGroupJobTypesContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypes)
);
