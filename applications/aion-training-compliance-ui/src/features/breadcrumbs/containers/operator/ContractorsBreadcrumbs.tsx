import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchContractorIfNeeded } from 'features/operator/contractor/actions';
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
  contractorId?: string;
  employeeId?: string;
  employeeTrainingRequirementId?: string;
};

const mapStateToProps = ({
  contractor: { contractor, isFetching: isFetchingContractor },
  employee: { employee, isFetching: isFetchingEmployee },
  employeeTrainingRequirement: { employeeTrainingRequirement, isFetching: isFetchingEmployeeTrainingRequirement }
}: RootState) => ({
  isFetchingContractor,
  contractor,
  isFetchingEmployee,
  isFetchingEmployeeTrainingRequirement,
  employee,
  employeeTrainingRequirement
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { contractorId, employeeId, employeeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorIfNeeded: () => contractorId && dispatch(fetchContractorIfNeeded(contractorId)),
  fetchEmployee: () => employeeId && dispatch(fetchEmployee(employeeId)),
  fetchEmployeeTrainingRequirement: () =>
    employeeTrainingRequirementId && dispatch(fetchEmployeeTrainingRequirement(employeeTrainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ContractorsBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorIfNeeded();
  }

  render() {
    const {
      isFetchingEmployee,
      isFetchingEmployeeTrainingRequirement,
      employee,
      employeeTrainingRequirement,
      isFetchingContractor,
      contractor,
      match: {
        params: { organizationId, contractorId, employeeId, employeeTrainingRequirementId }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: { pathname: `/${organizationId}/training-compliance/contractors` },
        label: t('trainingCompliance.common.contractors', 'Contractors')
      }
    ];

    if (contractorId && !isFetchingContractor && contractor) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/contractors/${contractorId}` },
        label: contractor.name
      });
    }

    if (employeeId && !isFetchingEmployee && employee) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/contractors/${contractorId}/employee/${employeeId}` },
        label: employee.name
      });
    }

    if (employeeTrainingRequirementId && !isFetchingEmployeeTrainingRequirement && employeeTrainingRequirement) {
      links.push({
        to: {
          pathname: `/${organizationId}/training-compliance/contractors/${contractorId}/employee/${employeeId}/training/${employeeTrainingRequirementId}`
        },
        label: employeeTrainingRequirement.trainingRequirement.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const ContractorsBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContractorsBreadcrumbs))
);
