import * as React from 'react';
import { connect } from 'react-redux';
import { fetchContractorJobTypeTrainingRequirements } from 'features/contractor/jobTypeTrainingRequirements/actions';
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
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = ({
  workGroupJobType: {
    isFetching: isFetchingWorkGroupJobType,
    workGroupJobType,
    fetchError: fetchWorkGroupJobTypeError
  },
  contractorJobTypeTrainingRequirements: {
    isFetchingInitial: isFetchingInitialJobTypeTrainingRequirements,
    contractorJobTypeTrainingRequirements,
    totalCount,
    error: jobTypeTrainingRequirementsError
  }
}: RootState) => ({
  isFetchingInitialJobTypeTrainingRequirements:
    isFetchingWorkGroupJobType || isFetchingInitialJobTypeTrainingRequirements,
  workGroupJobType,
  contractorJobTypeTrainingRequirements,
  totalCount,
  error: jobTypeTrainingRequirementsError || fetchWorkGroupJobTypeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId, workGroupJobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  fetchContractorJobTypeTrainingRequirements: (jobTypeId: string) => (top: number = 0, skip: number = 0) =>
    dispatch(
      fetchContractorJobTypeTrainingRequirements(
        organizationId,
        jobTypeId,
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

class WorkGroupJobTypeTraining extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchWorkGroupJobTypeData();
  }

  fetchWorkGroupJobTypeData = async () => {
    const { fetchWorkGroupJobTypeIfNeeded, fetchContractorJobTypeTrainingRequirements } = this.props;
    const workGroupJobType = await fetchWorkGroupJobTypeIfNeeded();

    if (workGroupJobType) {
      const { jobTypeId } = workGroupJobType;
      fetchContractorJobTypeTrainingRequirements(jobTypeId)(0, 0);
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
      contractorJobTypeTrainingRequirements,
      fetchContractorJobTypeTrainingRequirements,
      isFetchingInitialJobTypeTrainingRequirements,
      error,
      totalCount,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeTrainingComponent
        isFetchingInitialJobTypeTrainingRequirements={isFetchingInitialJobTypeTrainingRequirements}
        error={error}
        contractorJobTypeTrainingRequirements={contractorJobTypeTrainingRequirements}
        workGroupJobType={workGroupJobType}
        totalCount={totalCount}
        searchValue={parse(search).trainingRequirementName || ''}
        handleSearch={this.handleSearch}
        fetchContractorJobTypeTrainingRequirements={fetchContractorJobTypeTrainingRequirements}
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
