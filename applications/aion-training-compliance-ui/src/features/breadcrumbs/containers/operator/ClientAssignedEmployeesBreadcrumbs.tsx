import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchEmployee } from 'features/operator/employee/actions';
import { fetchEmployeeTrainingRequirement } from 'features/contractor/employeeTrainingRequirement/actions/fetchEmployeeTrainingRequirement';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  employeeId?: string;
  employeeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  employee: { employee, isFetching: isFetchingEmployee },
  employeeTrainingRequirement: { employeeTrainingRequirement, isFetching: isFetchingEmployeeTrainingRequirement }
}: RootState) => ({
  isFetchingEmployee,
  isFetchingEmployeeTrainingRequirement,
  employee,
  employeeTrainingRequirement
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { employeeId, employeeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchEmployee: () => employeeId && dispatch(fetchEmployee(employeeId)),
  fetchEmployeeTrainingRequirement: () =>
    employeeTrainingRequirementId && dispatch(fetchEmployeeTrainingRequirement(employeeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ClientAssignedEmployeesBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchEmployee();
    props.fetchEmployeeTrainingRequirement();
  }

  render() {
    const {
      isFetchingEmployee,
      isFetchingEmployeeTrainingRequirement,
      employee,
      employeeTrainingRequirement,
      match: {
        params: { organizationId, employeeId, employeeTrainingRequirementId }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: { pathname: `/${organizationId}/training-compliance/assigned-employees` },
        label: t('trainingCompliance.common.allEmployees', 'All Employees')
      }
    ];

    if (employeeId && !isFetchingEmployee && employee) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/assigned-employees/${employeeId}` },
        label: employee.name
      });
    }

    if (employeeTrainingRequirementId && !isFetchingEmployeeTrainingRequirement && employeeTrainingRequirement) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/assigned-employees/${employeeId}/training/${employeeTrainingRequirementId}`
        },
        label: employeeTrainingRequirement.trainingRequirement.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const ClientAssignedEmployeesBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ClientAssignedEmployeesBreadcrumbs))
);
