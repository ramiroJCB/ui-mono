import * as React from 'react';
import { ClientContractorTasksComponent } from '../components/ClientContractorTasks';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchAssigneeIfNeeded } from 'features/tasks/assignee/actions';
import { fetchContractorTasksIfNeeded } from 'features/tasks/contractor/tasks/actions';
import { IClientContractorTasksTableOption } from 'interfaces/clientContractorTasksTableOption';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId: string;
};

const mapStateToProps = (state: RootState) => ({
  contractorTasks: state.contractorTasks,
  assignee: state.assignee
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { contractorId, organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchAssigneeIfNeeded: () => dispatch(fetchAssigneeIfNeeded(contractorId)),
  fetchContractorTasksIfNeeded: () =>
    dispatch(fetchContractorTasksIfNeeded(contractorId, parse(search), organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientContractorTasks extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchAssigneeIfNeeded();
    props.fetchContractorTasksIfNeeded();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchContractorTasksIfNeeded();
    }
  }

  handleRowSelect = ({ id: taskId, taskGroupId }: IClientContractorTasksTableOption) => {
    const {
      history,
      match: {
        params: { organizationId, contractorId }
      }
    } = this.props;

    history.push(`/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors/${contractorId}/task/${taskId}`);
  };

  render() {
    const {
      contractorTasks: { contractorTasks, totalContractorTasksCount, isFetching: isFetchingContractorTasks },
      assignee: { isFetching: isFetchingOrganization, error: fetchAssigneeError, assignee },
      match: {
        params: { organizationId }
      }
    } = this.props;

    return !isFetchingOrganization && assignee ? (
      <ClientContractorTasksComponent
        contractor={assignee}
        contractorTasks={contractorTasks}
        handleRowSelect={this.handleRowSelect}
        organizationId={organizationId}
        isFetchingData={isFetchingContractorTasks}
        totalOptionsCount={totalContractorTasksCount}
      />
    ) : fetchAssigneeError ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientContractorTasksContainer = connect(mapStateToProps, mapDispatchToProps)(ClientContractorTasks);
