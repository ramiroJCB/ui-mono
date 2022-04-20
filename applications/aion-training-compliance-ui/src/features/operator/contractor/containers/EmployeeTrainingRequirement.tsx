import * as React from 'react';
import { connect } from 'react-redux';
import { EmployeeTrainingRequirementComponent } from '../components/EmployeeTrainingRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { fetchEmployeeTrainingRequirementIfNeeded } from 'features/contractor/employeeTrainingRequirement/actions/fetchEmployeeTrainingRequirement';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
  employeeTrainingRequirementId: string;
};

const mapStateToProps = ({
  employeeTrainingRequirement: {
    isFetching: isFetchingEmployeeTrainingRequirement,
    employeeTrainingRequirement,
    pendingDocuments,
    error: employeeTrainingRequirementError
  }
}: RootState) => ({
  isFetching: isFetchingEmployeeTrainingRequirement,
  employeeTrainingRequirement,
  pendingDocuments,
  error: employeeTrainingRequirementError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { employeeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchEmployeeTrainingRequirementIfNeeded: () =>
    dispatch(fetchEmployeeTrainingRequirementIfNeeded(employeeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EmployeeTrainingRequirement extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchEmployeeTrainingRequirementIfNeeded();
  }

  render() {
    const { employeeTrainingRequirement, isFetching, error, pendingDocuments } = this.props;
    const existingDocuments = employeeTrainingRequirement
      ? employeeTrainingRequirement.metaData.filter(document => document.isDeleted === false)
      : [];

    return (
      <EmployeeTrainingRequirementComponent
        isFetching={isFetching}
        error={error}
        employeeTrainingRequirement={employeeTrainingRequirement}
        uploadedDocuments={[...existingDocuments, ...pendingDocuments]}
      />
    );
  }
}

export const EmployeeTrainingRequirementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeTrainingRequirement);
