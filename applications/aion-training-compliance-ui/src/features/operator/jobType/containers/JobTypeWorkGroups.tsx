import * as React from 'react';
import { connect } from 'react-redux';
import { fetchJobTypeWorkGroups } from 'features/operator/jobTypeWorkGroups/actions';
import { JobTypeWorkGroupsComponent } from '../components/JobTypeWorkGroups';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.jobTypeWorkGroups;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { jobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypeWorkGroups: (top: number = 0, skip: number = 0) =>
    dispatch(fetchJobTypeWorkGroups(jobTypeId, top, skip, parse(search).name))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeWorkGroups extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypeWorkGroups();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchJobTypeWorkGroups,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchJobTypeWorkGroups();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      jobTypeWorkGroups,
      error,
      totalCount,
      fetchJobTypeWorkGroups,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <JobTypeWorkGroupsComponent
        isFetchingInitialWorkGroups={isFetchingInitial}
        error={error}
        jobTypeWorkGroups={jobTypeWorkGroups}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchJobTypeWorkGroups={fetchJobTypeWorkGroups}
      />
    );
  }
}

export const JobTypeWorkGroupsContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeWorkGroups)
);
