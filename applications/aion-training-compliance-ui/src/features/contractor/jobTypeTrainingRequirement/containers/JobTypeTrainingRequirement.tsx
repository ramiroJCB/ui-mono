import * as React from 'react';
import { connect } from 'react-redux';
import { fetchContractorJobTypeTrainingRequirementIfNeeded } from '../actions';
import { JobTypeTrainingRequirementComponent } from '../components/JobTypeTrainingRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  jobTypeTrainingRequirementId: string;
};

const mapStateToProps = (state: RootState) => state.contractorJobTypeTrainingRequirement;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { jobTypeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorJobTypeTrainingRequirementIfNeeded: () =>
    dispatch(fetchContractorJobTypeTrainingRequirementIfNeeded(jobTypeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class JobTypeTrainingRequirement extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorJobTypeTrainingRequirementIfNeeded();
  }

  render() {
    const { contractorJobTypeTrainingRequirement, isFetching, error } = this.props;

    return (
      <JobTypeTrainingRequirementComponent
        isFetching={isFetching}
        error={error}
        contractorJobTypeTrainingRequirement={contractorJobTypeTrainingRequirement}
      />
    );
  }
}

export const JobTypeTrainingRequirementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobTypeTrainingRequirement);
