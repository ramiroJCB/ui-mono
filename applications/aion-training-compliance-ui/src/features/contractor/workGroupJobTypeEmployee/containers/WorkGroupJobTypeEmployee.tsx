import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeEmployeeTraining } from 'features/workGroupJobTypeEmployeeTraining/actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeEmployeeComponent } from '../components/WorkGroupJobTypeEmployee';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobTypeEmployeeTraining;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { clientId, workGroupJobTypeEmployeeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeEmployeeTraining: (top: number = 0, skip: number = 0) =>
    dispatch(
      fetchWorkGroupJobTypeEmployeeTraining(
        clientId,
        workGroupJobTypeEmployeeId,
        top,
        skip,
        parse(search).trainingRequirementName
      )
    )
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeEmployee extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeEmployeeTraining();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchWorkGroupJobTypeEmployeeTraining,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupJobTypeEmployeeTraining();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('trainingRequirementName', searchText);

  render() {
    const {
      workGroupJobTypeEmployeeTraining,
      error,
      totalCount,
      fetchWorkGroupJobTypeEmployeeTraining,
      isFetchingInitial,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeEmployeeComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        workGroupJobTypeEmployeeTraining={workGroupJobTypeEmployeeTraining}
        totalCount={totalCount}
        searchValue={parse(search).trainingRequirementName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypeEmployeeTraining={fetchWorkGroupJobTypeEmployeeTraining}
      />
    );
  }
}

export const WorkGroupJobTypeEmployeeContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeEmployee)
);
