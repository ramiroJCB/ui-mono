import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupContractors } from '../actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupContractorsComponent } from '../components/WorkGroupContractors';

type RouteParams = {
  organizationId: string;
  clientId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupContractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId, clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupContractors: (top: number = 0, skip: number = 0) =>
    dispatch(fetchWorkGroupContractors(organizationId, clientId, top, skip, parse(search).workGroupName))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupContractors();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchWorkGroupContractors,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupContractors();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('workGroupName', searchText);

  render() {
    const {
      workGroupContractors,
      error,
      totalCount,
      fetchWorkGroupContractors,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <WorkGroupContractorsComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        workGroupContractors={workGroupContractors}
        totalCount={totalCount}
        searchValue={parse(search).workGroupName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroups={fetchWorkGroupContractors}
      />
    );
  }
}

export const WorkGroupContractorsContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupContractors)
);
