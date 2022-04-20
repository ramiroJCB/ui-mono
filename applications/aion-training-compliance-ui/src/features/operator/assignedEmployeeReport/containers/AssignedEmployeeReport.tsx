import * as React from 'react';
import { assignedEmployeeReportSelectors, fetchAssignedEmployeeReport } from '../slice';
import { connect } from 'react-redux';
import { fetchClientAssignedEmployees } from 'features/operator/clientAssignedEmployees/actions';
import { fetchContractors } from 'features/operator/contractors/actions';
import { fetchJobTypes } from 'features/operator/jobTypes/actions';
import { fetchTrainings } from 'features/operator/trainings/actions';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { IAssignedEmployeeReportFilters } from 'interfaces/assignedEmployeeReportFilters';
import { merge, parse, stringify } from '@pec/aion-ui-core/helpers/querystring';
import { ParsedUrlQuery } from 'querystring';
import { ReportTable } from '../components/ReportTable';
import { getRequirementStatuses } from '../components/ReportFilters';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { clientAssignedEmployees } = state.clientAssignedEmployees;
  const { contractors } = state.contractors;
  const { workGroups } = state.workGroups;
  const { jobTypes } = state.jobTypes;
  const { trainings } = state.trainings;

  return {
    ...state.assignedEmployeeReport,
    report: assignedEmployeeReportSelectors.selectAll(state),
    clientAssignedEmployees,
    contractors,
    workGroups,
    jobTypes,
    trainings
  };
};
const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchAssignedEmployeeReport: (urlQuery?: ParsedUrlQuery) =>
    dispatch(fetchAssignedEmployeeReport({ organizationId, urlQuery: urlQuery || parse(search) })),
  fetchClientAssignedEmployees: (employees?: string) =>
    (employees || parse(search)?.employees) &&
    dispatch(
      fetchClientAssignedEmployees(organizationId, 100, 0, undefined, employees || (parse(search)?.employees as string))
    ),
  fetchContractors: (contractors?: string) =>
    (contractors || parse(search)?.contractors) &&
    dispatch(
      fetchContractors(organizationId, 100, 0, undefined, contractors || (parse(search)?.contractors as string))
    ),
  fetchWorkGroups: (workGroups?: string) =>
    (workGroups || parse(search)?.workGroups) &&
    dispatch(fetchWorkGroups(organizationId, 100, 0, undefined, workGroups || (parse(search)?.workGroups as string))),
  fetchJobTypes: (jobTypes?: string) =>
    (jobTypes || parse(search)?.jobTypes) &&
    dispatch(fetchJobTypes(organizationId, 100, 0, undefined, jobTypes || (parse(search)?.jobTypes as string))),
  fetchTrainings: (trainings?: string) =>
    (trainings || parse(search)?.trainings) &&
    dispatch(fetchTrainings(organizationId, 100, 0, undefined, trainings || (parse(search)?.trainings as string)))
});

type QueryStringParams = {
  [key: string]: string | undefined;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps &
  I18nextProps;

class AssignedEmployeeReport extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchAssignedEmployeeReport();
    props.fetchClientAssignedEmployees();
    props.fetchContractors();
    props.fetchWorkGroups();
    props.fetchJobTypes();
    props.fetchTrainings();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;
    if (prevSearch !== search) {
      this.props.fetchAssignedEmployeeReport();
    }
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;
    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      })
    });
  };

  onSubmit = (values: IAssignedEmployeeReportFilters) => {
    const filters = {
      employees: values.employees?.map(({ employeeId }) => employeeId).join(',') ?? '',
      contractors: values.contractors?.map(({ id }) => id).join(',') ?? '',
      workGroups: values.workGroups?.map(({ id }) => id).join(',') ?? '',
      jobTypes: values.jobTypes?.map(({ id }) => id).join(',') ?? '',
      trainings: values.trainings?.map(({ id }) => id).join(',') ?? '',
      status: values.status?.value ?? ''
    };

    this.props.history.push({
      search: stringify(filters)
    });

    this.props.fetchAssignedEmployeeReport(filters);
    this.props.fetchClientAssignedEmployees(filters.employees);
    this.props.fetchContractors(filters.contractors);
    this.props.fetchWorkGroups(filters.workGroups);
    this.props.fetchJobTypes(filters.jobTypes);
    this.props.fetchTrainings(filters.trainings);
  };

  render() {
    const {
      isFetching,
      error,
      location: { search },
      report,
      clientAssignedEmployees,
      contractors,
      workGroups,
      jobTypes,
      trainings,
      total,
      t
    } = this.props;
    const {
      employees: qsEmployees,
      contractors: qsContractors,
      workGroups: qsWorkGroups,
      jobTypes: qsJobTypes,
      trainings: qsTrainings,
      status,
      page
    } = parse(search) as QueryStringParams;
    const requirementStatuses = getRequirementStatuses(t);
    const initialValues: IAssignedEmployeeReportFilters = {
      employees: clientAssignedEmployees
        ? clientAssignedEmployees.filter(({ employeeId }) => qsEmployees?.split(',').includes(employeeId))
        : undefined,
      contractors: contractors ? contractors.filter(({ id }) => qsContractors?.split(',').includes(id)) : undefined,
      workGroups: workGroups ? workGroups.filter(({ id }) => qsWorkGroups?.split(',').includes(id)) : undefined,
      jobTypes: jobTypes ? jobTypes.filter(({ id }) => qsJobTypes?.split(',').includes(id)) : undefined,
      trainings: trainings ? trainings.filter(({ id }) => qsTrainings?.split(',').includes(id)) : undefined,
      status: requirementStatuses ? requirementStatuses.find(({ value }) => value === status) : undefined
    };

    return (
      <ReportTable
        isFetching={isFetching}
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        report={report}
        error={error}
        isFiltered={Boolean(status)}
        handlePageChange={this.handleChangePage}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        total={total}
      />
    );
  }
}

export const AssignedEmployeeReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AssignedEmployeeReport));
