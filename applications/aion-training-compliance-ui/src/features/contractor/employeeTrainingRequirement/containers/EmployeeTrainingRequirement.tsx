import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { addEmployeeTrainingRequirementDocument } from '../actions/addEmployeeTrainingRequirementDocument';
import { connect } from 'react-redux';
import { editEmployeeTrainingRequirement } from '../actions/editEmployeeTrainingRequirement';
import { EmployeeTrainingRequirementComponent } from '../components/EmployeeTrainingRequirement';
import { fetchEmployeeTrainingRequirementIfNeeded } from '../actions/fetchEmployeeTrainingRequirement';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { InvalidFileUpload } from '@pec/aion-ui-core/interfaces/invalidFileUpload';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
  employeeTrainingRequirementId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  employeeTrainingRequirement: {
    isFetching: isFetchingEmployeeTrainingRequirement,
    employeeTrainingRequirement,
    pendingDocuments,
    error: employeeTrainingRequirementError
  }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingEmployeeTrainingRequirement,
  employeeTrainingRequirement,
  userInfo,
  pendingDocuments,
  error: userInfoError || employeeTrainingRequirementError
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
    dispatch(fetchEmployeeTrainingRequirementIfNeeded(employeeTrainingRequirementId)),
  editEmployeeTrainingRequirement: (values: IEmployeeTrainingRequirement) =>
    dispatch(editEmployeeTrainingRequirement(employeeTrainingRequirementId, values)),
  addDocuments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
    dispatch(addEmployeeTrainingRequirementDocument(employeeTrainingRequirementId, acceptedFiles, rejectedFiles)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EmployeeTrainingRequirement extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchEmployeeTrainingRequirementIfNeeded();
    props.fetchUserInfoIfNeeded();
  }

  hasGlobalPermission = (action: ActivityAction, resourceName: ActivityResourceName) =>
    hasPermission(this.props.userInfo, action, resourceName);

  hasOrganizationPermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    const {
      userInfo,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return organizationId
      ? hasPermission(userInfo, action, resourceName, [
          {
            type: UserInfoActivitiesType.Organization,
            id: organizationId
          }
        ])
      : false;
  };

  onSubmit = async (
    {
      uploadedFiles: { acceptedFiles, rejectedFiles },
      ...employeeTrainingRequirement
    }: IEmployeeTrainingRequirementForm,
    form: FormApi<IEmployeeTrainingRequirementForm>
  ) => {
    await Promise.all([
      this.props.editEmployeeTrainingRequirement(employeeTrainingRequirement),
      this.props.addDocuments(acceptedFiles, rejectedFiles)
    ]);
    form.reset();
  };

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
        onSubmit={this.onSubmit}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const EmployeeTrainingRequirementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeTrainingRequirement);
