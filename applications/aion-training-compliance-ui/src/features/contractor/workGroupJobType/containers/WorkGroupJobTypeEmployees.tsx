import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupJobTypeEmployees } from 'features/workGroupJobTypeEmployees/actions/fetchWorkGroupJobTypeEmployees';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { unassignWorkGroupJobTypeEmployee } from 'features/workGroupJobTypeEmployee/actions/unassignWorkGroupJobTypeEmployee';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeEmployeesComponent } from '../components/WorkGroupJobTypeEmployees';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo },
  workGroupJobTypeEmployees: { isFetchingInitial, workGroupJobTypeEmployees, totalCount, error }
}: RootState) => ({
  isFetchingInitial,
  workGroupJobTypeEmployees,
  totalCount,
  userInfo,
  error
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
  fetchWorkGroupJobTypeEmployees: (top: number = 0, skip: number = 0) =>
    dispatch(fetchWorkGroupJobTypeEmployees(organizationId, workGroupJobTypeId, top, skip, parse(search).employeeName)),
  unassignWorkGroupJobTypeEmployee: (workGroupJobTypeEmployeeId: string) => () =>
    dispatch(unassignWorkGroupJobTypeEmployee(workGroupJobTypeEmployeeId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeEmployees extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeEmployees();
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

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchWorkGroupJobTypeEmployees,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupJobTypeEmployees();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('employeeName', searchText);

  render() {
    const {
      workGroupJobTypeEmployees,
      error,
      totalCount,
      fetchWorkGroupJobTypeEmployees,
      isFetchingInitial,
      unassignWorkGroupJobTypeEmployee,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeEmployeesComponent
        isFetchingInitial={isFetchingInitial}
        error={error}
        workGroupJobTypeEmployees={workGroupJobTypeEmployees}
        totalCount={totalCount}
        searchValue={parse(search).employeeName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypeEmployees={fetchWorkGroupJobTypeEmployees}
        unassignWorkGroupJobTypeEmployee={unassignWorkGroupJobTypeEmployee}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const WorkGroupJobTypeEmployeesContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeEmployees)
);
