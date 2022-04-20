import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { fetchWorkGroupJobTypeEmployeeTraining } from 'features/workGroupJobTypeEmployeeTraining/actions';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeEmployeeTrainingComponent } from '../components/WorkGroupJobTypeEmployeeTrainingRequirements';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
  workGroupJobTypeEmployeeId: string;
};

const mapStateToProps = ({
  workGroupJobTypeEmployeeTraining: {
    isFetchingInitial: isFetchingInitialEmployeeTraining,
    workGroupJobTypeEmployeeTraining,
    totalCount,
    error: workGroupJobTypeEmployeeTrainingError
  },
  workGroupJobTypeEmployee: {
    isFetching: isFetchingWorkGroupJobTypeEmployee,
    workGroupJobTypeEmployee,
    fetchError: fetchWorkGroupJobTypeEmployeeError
  }
}: RootState) => ({
  isFetchingWorkGroupJobTypeEmployee,
  isFetchingInitialEmployeeTraining,
  workGroupJobTypeEmployee,
  workGroupJobTypeEmployeeTraining,
  totalCount,
  error: workGroupJobTypeEmployeeTrainingError || fetchWorkGroupJobTypeEmployeeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { workGroupJobTypeEmployeeId, organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeEmployeeIfNeeded: () =>
    dispatch(fetchWorkGroupJobTypeEmployeeIfNeeded(workGroupJobTypeEmployeeId)),
  fetchWorkGroupJobTypeEmployeeTraining: (top: number = 0, skip: number = 0) =>
    dispatch(
      fetchWorkGroupJobTypeEmployeeTraining(
        organizationId,
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

class WorkGroupJobTypeEmployeeTrainingRequirements extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
    props.fetchWorkGroupJobTypeEmployeeTraining();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search },
      fetchWorkGroupJobTypeEmployeeTraining
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupJobTypeEmployeeTraining();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('trainingRequirementName', searchText);

  render() {
    const {
      workGroupJobTypeEmployee,
      workGroupJobTypeEmployeeTraining,
      fetchWorkGroupJobTypeEmployeeTraining,
      isFetchingWorkGroupJobTypeEmployee,
      isFetchingInitialEmployeeTraining,
      error,
      totalCount,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeEmployeeTrainingComponent
        isFetchingWorkGroupJobTypeEmployee={isFetchingWorkGroupJobTypeEmployee}
        isFetchingInitialEmployeeTraining={isFetchingInitialEmployeeTraining}
        error={error}
        workGroupJobTypeEmployeeTraining={workGroupJobTypeEmployeeTraining}
        workGroupJobTypeEmployee={workGroupJobTypeEmployee}
        totalCount={totalCount}
        searchValue={parse(search).trainingRequirementName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypeEmployeeTraining={fetchWorkGroupJobTypeEmployeeTraining}
      />
    );
  }
}

export const WorkGroupJobTypeEmployeeTrainingContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeEmployeeTrainingRequirements)
);
