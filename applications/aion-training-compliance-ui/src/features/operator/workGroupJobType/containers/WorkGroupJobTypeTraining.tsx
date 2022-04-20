import * as React from 'react';
import { connect } from 'react-redux';
import { fetchOperatorJobTypeTrainingRequirements } from 'features/operator/jobTypeTrainingRequirements/actions/fetchJobTypeTrainingRequirements';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeTrainingComponent } from '../components/WorkGroupJobTypeTraining';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = ({
  workGroupJobType: {
    isFetching: isFetchingWorkGroupJobType,
    workGroupJobType,
    fetchError: fetchWorkGroupJobTypeError
  },
  operatorJobTypeTrainingRequirements: {
    isFetchingInitial: isFetchingInitialJobTypeTrainingRequirements,
    operatorJobTypeTrainingRequirements,
    totalCount,
    error: jobTypeTrainingRequirementsError
  }
}: RootState) => ({
  isFetchingWorkGroupJobType,
  isFetchingInitialJobTypeTrainingRequirements,
  workGroupJobType,
  operatorJobTypeTrainingRequirements,
  totalCount,
  error: jobTypeTrainingRequirementsError || fetchWorkGroupJobTypeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { workGroupJobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchOperatorJobTypeTrainingRequirements: (jobTypeId: string) => (top: number = 0, skip: number = 0) =>
    dispatch(fetchOperatorJobTypeTrainingRequirements(jobTypeId, top, skip, parse(search).trainingRequirementName))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeTraining extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchWorkGroupJobTypeData();
  }

  fetchWorkGroupJobTypeData = async () => {
    const { fetchWorkGroupJobTypeIfNeeded, fetchOperatorJobTypeTrainingRequirements } = this.props;
    const workGroupJobType = await fetchWorkGroupJobTypeIfNeeded();

    if (workGroupJobType) {
      const { jobTypeId } = workGroupJobType;
      fetchOperatorJobTypeTrainingRequirements(jobTypeId)(0, 0);
    }
  };

  componentDidUpdate({ workGroupJobType: prevWorkGroupJobType, location: { search: prevSearch } }: Props) {
    const {
      workGroupJobType,
      location: { search }
    } = this.props;

    if (prevSearch !== search || prevWorkGroupJobType !== workGroupJobType) {
      this.fetchWorkGroupJobTypeData();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('trainingRequirementName', searchText);

  render() {
    const {
      workGroupJobType,
      operatorJobTypeTrainingRequirements,
      fetchOperatorJobTypeTrainingRequirements,
      isFetchingInitialJobTypeTrainingRequirements,
      error,
      totalCount,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeTrainingComponent
        isFetchingInitialJobTypeTrainingRequirements={isFetchingInitialJobTypeTrainingRequirements}
        error={error}
        operatorJobTypeTrainingRequirements={operatorJobTypeTrainingRequirements}
        workGroupJobType={workGroupJobType}
        totalCount={totalCount}
        searchValue={parse(search).trainingRequirementName || ''}
        handleSearch={this.handleSearch}
        fetchOperatorJobTypeTrainingRequirements={fetchOperatorJobTypeTrainingRequirements}
      />
    );
  }
}

export const WorkGroupJobTypeTrainingContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeTraining)
);
